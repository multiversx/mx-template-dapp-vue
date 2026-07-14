# MultiversX Template dApp (Vue)

The **MultiversX dApp Template** built with [Vue 3](https://vuejs.org/) + TypeScript + [Vite](https://vitejs.dev/). It is a reference implementation of [@multiversx/sdk-dapp](https://www.npmjs.com/package/@multiversx/sdk-dapp) v5, demonstrating:

- wallet authentication (browser extension, xPortal / WalletConnect, web wallet, Ledger)
- transaction signing, sending, and tracking
- message signing
- smart-contract interaction (a Ping-Pong contract)
- **how to bridge sdk-dapp's framework-agnostic store into Vue reactivity** with composables (sdk-dapp ships React hooks, but its store works in any framework)

> **Looking for another framework?** The same dApp exists for React (TS and JS), Next.js, Angular, SolidJS, and React Native — see [Other templates](#other-templates).

## Requirements

- Node.js 24
- pnpm 11 (the repo ships a `pnpm-lock.yaml` — use pnpm, not npm or yarn)

> pnpm blocks native postinstall build scripts by default; the allowlist (`keccak`, `protobufjs`, `unrs-resolver`) lives in `pnpm-workspace.yaml` under `allowBuilds`. If `pnpm install` exits non-zero over a new dependency's build script, add it there.

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start the dev server on the desired network

```bash
pnpm start-devnet     # or start-testnet / start-mainnet
```

Open [https://localhost:5173](https://localhost:5173) (note **https** — wallet providers only work on secure origins). The dev server uses the self-signed `localhost-cert.pem` / `localhost-key.pem` committed in the repo root (hardcoded in `vite.config.ts`); accept the browser warning. Do not remove these certificates.

### 3. Build for production

```bash
pnpm build-devnet     # or build-testnet / build-mainnet
```

This type-checks (`vue-tsc`) and builds to `dist/` — deploy it to any static host.

## Available scripts

| Script | Description |
| --- | --- |
| `pnpm start-devnet` / `start-testnet` / `start-mainnet` | Copy the network config, then run the Vite dev server on `https://localhost:5173` |
| `pnpm build-devnet` / `build-testnet` / `build-mainnet` | Copy the network config, then type-check + build to `dist/` |
| `pnpm copy-devnet-config` (also `testnet` / `mainnet`) | Copy `src/config/config.<network>.ts` over `src/config/index.ts` |
| `pnpm dev` | Vite dev server with the currently active config |
| `pnpm build` | Type-check + build with the currently active config |
| `pnpm build-only` | Build without type-checking |
| `pnpm type-check` | `vue-tsc --build` only |
| `pnpm preview` | Serve the production build |
| `pnpm lint` | ESLint with `--fix` over `src` |

There is no test runner configured in this template.

## Network configuration

There is **no `.env` file**. The active network (devnet / testnet / mainnet) is selected at dev/build time by copying one of the per-network config files over the generated index:

- `src/config/config.devnet.ts`, `config.testnet.ts`, `config.mainnet.ts` — per-network values (`contractAddress`, `environment`)
- `src/config/sharedConfig.ts` — values common to all networks
- `src/config/index.ts` — **generated** by the `copy-*-config` scripts; never edit it by hand, it is overwritten on every `start-*` / `build-*`

The `environment` exported by the active config is passed to sdk-dapp's `initApp` in `src/main.ts`, so the copy mechanism is the single source of truth for the network.

## Project structure

```
src/
├── assets/          # main.css (Tailwind v4 + custom @utility classes)
├── components/      # pages (HomePage, DashboardPage, DisclaimerPage) + shared components
├── composables/     # useAuth, useEnvironment, usePingPong — the SDK-store → Vue-reactivity bridge
├── config/          # per-network configs (see Network configuration)
├── helpers/         # generic utilities
├── types/           # shared TypeScript types
├── widgets/         # dashboard feature widgets (Account, PingPongRaw, SignMessage)
├── App.vue          # shell: Header / router-view / Footer
└── main.ts          # entry: routes + auth guard, awaits initApp(config), then mounts the app
```

## How sdk-dapp is used

1. **Bootstrap** — `src/main.ts` calls `initApp(config)` (storage, environment from `src/config`) and mounts the Vue app only inside the `.then()`. Nothing that touches the SDK works before `initApp` resolves.
2. **SDK imports** — this template imports sdk-dapp functions from deep paths (e.g. `@multiversx/sdk-dapp/out/methods/account/getAccount`); there is no barrel layer. State lives in the SDK's own store (`getStore()`) — there is no Pinia/Vuex.
3. **The Vue reactivity bridge (the key concept)** — composables in `src/composables/` subscribe to the SDK store and mirror values into Vue refs:
   - `useAuth` — login state (`isLoggedIn`), plus `logout()`
   - `useEnvironment` — current network config
   - `usePingPong` — the full example: builds `Transaction` objects, signs via `getAccountProvider().signTransactions()`, sends/tracks through `TransactionManager`, and queries contract state
4. **Login** — the connect button opens sdk-dapp's `UnlockPanelManager`, which lists all available providers.
5. **Routing & auth** — routes are defined in `src/main.ts` with a global `beforeEach` guard: logged-in users are redirected to `/dashboard`, unauthenticated users away from auth-required routes.
6. **Dashboard widgets** — `DashboardPage.vue` renders a `WIDGETS` array through `Widget.vue`. To add a feature: create it in `src/widgets/`, export it from `src/widgets/index.ts`, and add an entry to the array.

## Other templates

The same template dApp is implemented across several frameworks. If another stack suits your project better, start from one of these instead:

| Template | Stack | Repository |
| --- | --- | --- |
| React (TypeScript) | React 18 · TypeScript · Vite | [mx-template-dapp](https://github.com/multiversx/mx-template-dapp) |
| React (JavaScript) | React 19 · JSX · Vite | [mx-template-dapp-reactjs](https://github.com/multiversx/mx-template-dapp-reactjs) |
| Next.js | Next.js 16 (App Router) · TypeScript | [mx-template-dapp-nextjs](https://github.com/multiversx/mx-template-dapp-nextjs) |
| SolidJS | SolidJS · TypeScript · Vite | [mx-template-dapp-solidjs](https://github.com/multiversx/mx-template-dapp-solidjs) |
| Vue **← this repo** | Vue 3 · TypeScript · Vite | [mx-template-dapp-vue](https://github.com/multiversx/mx-template-dapp-vue) |
| Angular | Angular 20 · TypeScript | [mx-template-dapp-angular](https://github.com/multiversx/mx-template-dapp-angular) |
| React Native | React Native | [mx-template-dapp-react-native](https://github.com/multiversx/mx-template-dapp-react-native) |

## Links

- [@multiversx/sdk-dapp on GitHub](https://github.com/multiversx/mx-sdk-dapp) · [on npm](https://www.npmjs.com/package/@multiversx/sdk-dapp)
- [MultiversX developer docs](https://docs.multiversx.com/)
- [Vue documentation](https://vuejs.org/)
