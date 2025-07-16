import { getNetworkConfig } from '@multiversx/sdk-dapp/out/methods/network/getNetworkConfig';
import { getStore } from '@multiversx/sdk-dapp/out/store/store';
import type { NetworkType } from '@multiversx/sdk-dapp/out/types/network.types';
import { ref, onMounted, onUnmounted, computed } from 'vue';

const networkConfig = ref<NetworkType | null>(null);
let storeUnsubscribe: (() => void) | undefined;

function updateNetworkConfig() {
  const config = getNetworkConfig();
  networkConfig.value = config.network;
}

function getEnvironment() {
  return networkConfig.value?.id || 'not-configured';
}

export function useEnvironment() {
  const environment = computed(() => getEnvironment());
  const network = computed(() => networkConfig.value);

  // Initialize on first use
  if (!storeUnsubscribe) {
    updateNetworkConfig();

    // Subscribe to store changes for reactivity
    const store = getStore();
    storeUnsubscribe = store.subscribe(() => {
      updateNetworkConfig();
    });
  }

  return {
    environment,
    network,
    getEnvironment,
  };
}
