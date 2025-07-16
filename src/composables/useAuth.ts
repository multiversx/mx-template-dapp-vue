import { getIsLoggedIn } from '@multiversx/sdk-dapp/out/methods/account/getIsLoggedIn';
import { getAccountProvider } from '@multiversx/sdk-dapp/out/providers/helpers/accountProvider';
import { getStore } from '@multiversx/sdk-dapp/out/store/store';
import { ref, onMounted, onUnmounted, readonly, computed } from 'vue';

const isLoggedIn = ref(false);
let storeUnsubscribe: (() => void) | undefined;

function checkLoginState() {
  // Check the actual login state from SDK-DAPP
  const loggedIn = getIsLoggedIn();
  isLoggedIn.value = loggedIn;
}

function subscribeToStoreChanges() {
  // Subscribe to store changes to keep login state in sync
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
  if (storeUnsubscribe) {
    storeUnsubscribe();
    storeUnsubscribe = undefined;
  }
}

// Initialize auth state when composable is first imported
checkLoginState();
subscribeToStoreChanges();

export function useAuth() {
  onMounted(() => {
    // Re-check on mount in case state changed
    checkLoginState();
  });

  onUnmounted(() => {
    // Clean up subscription when composable is destroyed (like ngOnDestroy)
    cleanup();
  });

  return {
    isLoggedIn: readonly(isLoggedIn),
    isLoggedIn$: computed(() => isLoggedIn.value), // Observable equivalent
    getIsLoggedIn: () => isLoggedIn.value,
    setLoggedIn,
    logout,
    cleanup,
  };
}
