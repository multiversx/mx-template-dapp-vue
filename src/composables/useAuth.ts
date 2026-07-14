import { getIsLoggedIn } from '@multiversx/sdk-dapp/out/methods/account/getIsLoggedIn';
import { getAccountProvider } from '@multiversx/sdk-dapp/out/providers/helpers/accountProvider';
import { getStore } from '@multiversx/sdk-dapp/out/store/store';
import { ref, onMounted, readonly, computed } from 'vue';

const isLoggedIn = ref(false);
let storeUnsubscribe: (() => void) | undefined;
let initialized = false;

function checkLoginState() {
  // Check the actual login state from SDK-DAPP
  const loggedIn = getIsLoggedIn();
  isLoggedIn.value = loggedIn;
}

function ensureSubscribed() {
  // Must run lazily (on first useAuth() call), NOT at module import time.
  // `initApp()` in main.ts replaces the SDK store instance (initStore creates
  // a brand-new store). Any subscription created before initApp resolves would
  // be attached to a throwaway store and would never fire on login. Because the
  // Vue app is only mounted inside initApp().then(), the first useAuth() call is
  // guaranteed to see the real, initialized store here.
  if (initialized) {
    return;
  }
  initialized = true;

  checkLoginState();

  const store = getStore();
  storeUnsubscribe = store.subscribe(() => {
    const loggedIn = getIsLoggedIn();
    if (isLoggedIn.value !== loggedIn) {
      isLoggedIn.value = loggedIn;
    }
  });
}

function setLoggedIn(loggedIn: boolean) {
  isLoggedIn.value = loggedIn;
}

async function logout() {
  const provider = getAccountProvider();
  await provider.logout();
  setLoggedIn(false);
}

function cleanup() {
  // The subscription is an app-lifetime singleton shared by every component
  // that calls useAuth(); it is intentionally NOT torn down on component
  // unmount. This exists only for an explicit teardown if ever needed.
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = undefined;
    initialized = false;
  }
}

export function useAuth() {
  // Set up the singleton store subscription the first time the composable is
  // actually used (i.e. after initApp has swapped in the real store).
  ensureSubscribed();

  onMounted(() => {
    // Re-check on mount in case state changed
    checkLoginState();
  });

  return {
    isLoggedIn: readonly(isLoggedIn),
    isLoggedIn$: computed(() => isLoggedIn.value), // Observable equivalent
    getIsLoggedIn: () => isLoggedIn.value,
    setLoggedIn,
    logout,
    cleanup
  };
}
