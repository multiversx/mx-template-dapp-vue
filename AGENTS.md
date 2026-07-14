# AGENTS.md — mx-template-dapp-vue

Guidance for AI agents (and humans) working with code in this repository.

## What this is

A Vue 3 + Vite reference dApp for the MultiversX blockchain (the Vue counterpart to the React/Angular `mx-template-dapp` templates). It demonstrates wallet connection, smart-contract interaction (the ping-pong contract), and message signing via the `@multiversx/sdk-dapp` SDK.

## Toolchain

- **Package manager: pnpm** (there is a single `pnpm-lock.yaml` — do not reintroduce `yarn.lock`/`package-lock.json`). Node 24.
- **Vite 8** (uses the Rolldown bundler) + **Tailwind CSS v4** (CSS-first via `@tailwindcss/vite`; there is no `tailwind.config.js`).
- **ESLint flat config** in `eslint.config.js` (no `.eslintrc`). Prettier runs as an ESLint rule via `eslint-plugin-prettier`; import ordering uses `eslint-plugin-import-x` (the `eslint-plugin-import` fork that supports ESLint 10). Formatting (`vue/html-self-closing`, attribute wrapping) is owned by Prettier, so those Vue layout rules are intentionally disabled to avoid circular autofixes.
- pnpm blocks postinstall build scripts by default; the allowlist lives in **`pnpm-workspace.yaml`** under `allowBuilds` (`keccak`, `protobufjs`, `unrs-resolver`). Without it, `pnpm install` exits non-zero and breaks every script.

```sh
pnpm start-devnet    # copy devnet config + Vite dev server at https://localhost:5173 (also: start-testnet / start-mainnet)
pnpm build-devnet    # copy devnet config + type-check + build (also: build-testnet / build-mainnet)
pnpm dev             # Vite dev server with the currently active config (see TLS note below)
pnpm build           # type-check (vue-tsc) + production build, run in parallel
pnpm build-only      # build without type-check
pnpm type-check      # vue-tsc --build only
pnpm lint            # eslint src --fix (flat config)
pnpm preview         # serve the production build
```

There is **no test runner configured** — `tsconfig.app.json` excludes `src/**/__tests__/*` but no test tooling is installed.

The dev server requires `localhost-cert.pem` / `localhost-key.pem` (committed in the repo root) because `vite.config.ts` hardcodes HTTPS. MultiversX wallet providers require HTTPS, so do not remove this.

## Network configuration

The active network is selected by file copy: the `copy-*-config` scripts (run by every `start-*` / `build-*`) copy `src/config/config.<network>.ts` over `src/config/index.ts`.

- **`src/config/index.ts` is a generated file** — never edit it by hand; edit `config.devnet.ts` / `config.testnet.ts` / `config.mainnet.ts` or `sharedConfig.ts` instead. The committed default is devnet.
- Each per-network config exports the ping-pong `contractAddress` and `environment` (an `EnvironmentsEnum` value) and re-exports `sharedConfig.ts` (`GITHUB_REPO_URL`).
- `src/main.ts` imports `environment` from `@/config` and passes it to `initApp` — the copy mechanism is the single source of truth for the network.

## Architecture

**SDK initialization is async and gates the whole app.** `src/main.ts` calls `initApp(config)` and only mounts the Vue app inside the `.then()`. The config sets `storage` to `sessionStorage` and `environment` from the active `src/config`. Nothing that touches the SDK works before `initApp` resolves.

**SDK access pattern.** This template imports SDK functions from deep paths like `@multiversx/sdk-dapp/out/methods/...` rather than a barrel. State lives in the SDK's own store (`getStore()`), not in a Vue store (no Pinia/Vuex). Vue reactivity is bridged to it manually inside composables.

**Composables bridge the SDK store to Vue reactivity** (`src/composables/`):

- `useAuth` — login state. Module-level `ref` + `store.subscribe()` keeps `isLoggedIn` in sync; exposes `logout()`. The subscription is set up once at import time.
- `useEnvironment` — current network config, same subscribe pattern.
- `usePingPong` — the meatiest example: builds `Transaction` objects by hand, signs via `getAccountProvider().signTransactions()`, sends/tracks through `TransactionManager`, and reads contract state via raw `fetch` to `<apiAddress>/vm-values/query` with base64→hex→BigNumber decoding. Per-instance reactive state plus a 1s auto-refresh interval driven by login state.

Note: composables expose both plain refs (e.g. `timeToPong`) and `$`-suffixed computed "observable equivalents" — a compatibility shim mirroring the Angular/React versions. Prefer the plain refs for new code.

**Routing & auth guard** (`src/main.ts`). Three routes: `/` (Home), `/dashboard` (`requireAuth: true`), `/disclaimer`. A global `beforeEach` guard redirects logged-in users away from non-auth routes to `/dashboard`, and unauthenticated users away from auth routes to `/`.

**Dashboard is widget-driven.** `DashboardPage.vue` holds a `WIDGETS: WidgetType[]` array (title/description/reference + a Vue component) rendered through `Widget.vue`. To add a dashboard feature, create a widget in `src/widgets/`, export it from `src/widgets/index.ts`, and add an entry to that array.

**Layout.** `App.vue` renders `Header` / `router-view` / `Footer`; only the `/` route gets wrapped in the white card container.

## Conventions

- Path alias `@` → `src/` (defined in both `vite.config.ts` and `tsconfig.app.json`). Import style is mixed in the existing code (relative and `@/`).
- `vite-plugin-node-polyfills` is required — SDK code depends on Node globals like `Buffer`. `bignumber.js` is a direct dependency (used in `usePingPong.ts`); under pnpm's strict resolution it must stay declared, not relied on as a transitive hoist.
- Styling is Tailwind CSS v4 via `@tailwindcss/vite`. Custom utilities live in `src/assets/main.css` using `@utility` (e.g. `bg-mvx-white`) — there is no `tailwind.config.js`.
- Prettier (`.prettierrc`): single quotes, semicolons, no trailing commas, 2-space, LF. `no-explicit-any` is off; `vue/multi-word-component-names` is off (the template uses intentional single-word component names like `Button`, `Card`). Remaining `vue/require-default-prop` / `vue/no-required-prop-with-default` warnings are pre-existing and non-fatal.

## Verification

To prove a change works, run in order:

```bash
pnpm type-check          # vue-tsc
pnpm lint                # must pass
pnpm build-devnet        # production build must succeed
```

There are no automated tests — for login/transaction changes, start `pnpm start-devnet`, open `https://localhost:5173`, and exercise the flow manually. After `build-testnet`/`build-mainnet` runs, run `pnpm copy-devnet-config` so the committed `src/config/index.ts` shows no diff.

## Other templates

The same template dApp exists for other frameworks — useful when a task actually targets a different stack:

| Template | Stack | Repository |
| --- | --- | --- |
| React (TypeScript) | React 18 · TypeScript · Vite | [mx-template-dapp](https://github.com/multiversx/mx-template-dapp) |
| React (JavaScript) | React 19 · JSX · Vite | [mx-template-dapp-reactjs](https://github.com/multiversx/mx-template-dapp-reactjs) |
| Next.js | Next.js 16 (App Router) · TypeScript | [mx-template-dapp-nextjs](https://github.com/multiversx/mx-template-dapp-nextjs) |
| SolidJS | SolidJS · TypeScript · Vite | [mx-template-dapp-solidjs](https://github.com/multiversx/mx-template-dapp-solidjs) |
| Vue **← this repo** | Vue 3 · TypeScript · Vite | [mx-template-dapp-vue](https://github.com/multiversx/mx-template-dapp-vue) |
| Angular | Angular 20 · TypeScript | [mx-template-dapp-angular](https://github.com/multiversx/mx-template-dapp-angular) |
| React Native | React Native | [mx-template-dapp-react-native](https://github.com/multiversx/mx-template-dapp-react-native) |
