import { Address, Transaction } from '@multiversx/sdk-core/out';
import { GAS_PRICE } from '@multiversx/sdk-dapp/out/constants/mvx.constants';
import { TransactionManager } from '@multiversx/sdk-dapp/out/managers/TransactionManager';
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import { getIsLoggedIn } from '@multiversx/sdk-dapp/out/methods/account/getIsLoggedIn';
import { getNetworkConfig } from '@multiversx/sdk-dapp/out/methods/network/getNetworkConfig';
import { getPendingTransactions } from '@multiversx/sdk-dapp/out/methods/transactions/getPendingTransactions';
import { getAccountProvider } from '@multiversx/sdk-dapp/out/providers/helpers/accountProvider';
import BigNumber from 'bignumber.js';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { type SignedTransactionType } from '../components/TransactionOutput.vue';
import { contractAddress } from '@/config';

export interface PingPongResponseType {
  data: {
    data: {
      returnData: string[];
    };
  };
}

export interface TransactionsDisplayInfoType {
  processingMessage: string;
  errorMessage: string;
  successMessage: string;
}

const PING_TRANSACTION_INFO: TransactionsDisplayInfoType = {
  processingMessage: 'Processing Ping transaction',
  errorMessage: 'An error has occurred during Ping',
  successMessage: 'Ping transaction successful'
};

const PONG_TRANSACTION_INFO: TransactionsDisplayInfoType = {
  processingMessage: 'Processing Pong transaction',
  errorMessage: 'An error has occurred during Pong',
  successMessage: 'Pong transaction successful'
};

async function makeVmQuery(
  funcName: string,
  args: string[]
): Promise<PingPongResponseType> {
  const networkConfig = getNetworkConfig();

  const body = {
    scAddress: contractAddress,
    funcName,
    args
  };

  const response = await fetch(
    `${networkConfig.network.apiAddress}/vm-values/query`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

function decodeAmount(data: PingPongResponseType): string {
  if (!data.data.data.returnData) {
    return '0';
  }

  const returnValue = data.data.data.returnData[0];
  if (!returnValue) return '0';

  const decodedString = Buffer.from(returnValue, 'base64').toString('hex');
  return new BigNumber(decodedString, 16).toString(10);
}

function decodeTime(data: PingPongResponseType): number | null {
  if (!data.data.data.returnData) {
    return null;
  }

  const returnValue = data.data.data.returnData[0];
  if (returnValue === '' || !returnValue) {
    return 0;
  }

  const decodedString = Buffer.from(returnValue, 'base64').toString('hex');
  return new BigNumber(decodedString, 16).toNumber();
}

async function fetchPingAmount(): Promise<string> {
  try {
    const data = await makeVmQuery('getPingAmount', []);
    if (!data) {
      return '0';
    }
    return decodeAmount(data);
  } catch (error) {
    console.error('Unable to call getPingAmount', error);
    return '0';
  }
}

async function fetchTimeToPong(): Promise<number | null> {
  // Check if user is logged in first
  if (!getIsLoggedIn()) {
    return null;
  }

  try {
    const account = getAccount();
    const args = new Address(account.address).toHex();
    const data = await makeVmQuery('getTimeToPong', [args]);
    return decodeTime(data);
  } catch (error) {
    console.error('Unable to call getTimeToPong', error);
    return null;
  }
}

export function usePingPong() {
  // Local reactive state for each composable instance
  const pingAmount = ref<string>('0');
  const timeToPong = ref<number | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  let timeToPongRefreshInterval: number | undefined;

  function handleError(message: string, err: any): void {
    console.error(message, err);
    error.value = message;
    loading.value = false;
  }

  function clearError(): void {
    error.value = null;
  }

  async function refreshTimeToPong(): Promise<number | null> {
    try {
      const time = await fetchTimeToPong();
      timeToPong.value = time;
      return time;
    } catch (err) {
      handleError('Failed to fetch time to pong', err);
      return null;
    }
  }

  function startAutoRefresh(): void {
    // Only start auto-refresh if user is logged in
    if (!getIsLoggedIn()) return;

    if (timeToPongRefreshInterval) {
      clearInterval(timeToPongRefreshInterval);
    }

    timeToPongRefreshInterval = window.setInterval(async () => {
      // Check if still logged in before making API calls
      if (!getIsLoggedIn()) {
        stopAutoRefresh();
        return;
      }

      try {
        const time = await fetchTimeToPong();
        timeToPong.value = time;
      } catch (err) {
        handleError('Failed to fetch time to pong', err);
      }
    }, 1000);
  }

  function stopAutoRefresh(): void {
    if (timeToPongRefreshInterval) {
      clearInterval(timeToPongRefreshInterval);
      timeToPongRefreshInterval = undefined;
    }
  }

  async function sendPingTransaction(): Promise<string> {
    if (!getIsLoggedIn()) {
      throw new Error('User not logged in');
    }

    loading.value = true;
    error.value = null;

    try {
      const pingAmountValue = await fetchPingAmount();
      const account = getAccount();
      const networkConfig = getNetworkConfig();

      const pingTransaction = new Transaction({
        value: BigInt(pingAmountValue),
        data: Buffer.from('ping'),
        receiver: new Address(contractAddress),
        gasLimit: BigInt(6000000),
        gasPrice: BigInt(GAS_PRICE),
        chainID: networkConfig.network.chainId,
        sender: new Address(account.address),
        version: 1
      });

      const sessionId = await signAndSendTransactions(
        [pingTransaction],
        PING_TRANSACTION_INFO
      );

      loading.value = false;
      return sessionId;
    } catch (err) {
      handleError('Failed to send ping transaction', err);
      throw err;
    }
  }

  async function sendPongTransaction(): Promise<string> {
    if (!getIsLoggedIn()) {
      throw new Error('User not logged in');
    }

    loading.value = true;
    error.value = null;

    try {
      const account = getAccount();
      const networkConfig = getNetworkConfig();

      const pongTransaction = new Transaction({
        value: BigInt(0),
        data: Buffer.from('pong'),
        receiver: new Address(contractAddress),
        gasLimit: BigInt(6000000),
        gasPrice: BigInt(GAS_PRICE),
        chainID: networkConfig.network.chainId,
        sender: new Address(account.address),
        version: 1
      });

      const sessionId = await signAndSendTransactions(
        [pongTransaction],
        PONG_TRANSACTION_INFO
      );

      loading.value = false;
      return sessionId;
    } catch (err) {
      handleError('Failed to send pong transaction', err);
      throw err;
    }
  }

  async function signAndSendTransactions(
    transactions: Transaction[],
    transactionsDisplayInfo?: TransactionsDisplayInfoType
  ): Promise<string> {
    const provider = getAccountProvider();
    const txManager = TransactionManager.getInstance();

    const signedTransactions = await provider.signTransactions(transactions);
    const sentTransactions = await txManager.send(signedTransactions);
    const sessionId = await txManager.track(sentTransactions, {
      transactionsDisplayInfo
    });

    return sessionId;
  }

  function getPendingSignedTransactions(): SignedTransactionType[] {
    try {
      const pendingTransactions = getPendingTransactions();

      return pendingTransactions.map((tx) => ({
        hash: tx.hash,
        receiver: tx.receiver,
        value: tx.value?.toString() || '0',
        gasPrice: tx.gasPrice?.toString() || '0',
        gasLimit: tx.gasLimit?.toString() || '0',
        data: tx.data
      }));
    } catch (err) {
      console.error('Error getting pending transactions:', err);
      return [];
    }
  }

  // Watch for login state changes
  const isLoggedIn = computed(() => getIsLoggedIn());

  watch(
    isLoggedIn,
    (loggedIn) => {
      if (loggedIn) {
        startAutoRefresh();
        // Initial fetch when user logs in
        refreshTimeToPong();
      } else {
        stopAutoRefresh();
        // Clear state when user logs out
        timeToPong.value = null;
        pingAmount.value = '0';
        error.value = null;
        loading.value = false;
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    if (getIsLoggedIn()) {
      startAutoRefresh();
      refreshTimeToPong();
    }
  });

  onUnmounted(() => {
    stopAutoRefresh();
  });

  return {
    // Reactive values that match what the widget expects
    timeToPong,
    pingAmount,
    loading,
    error,

    // Legacy computed properties for backwards compatibility
    pingAmount$: computed(() => pingAmount.value),
    timeToPong$: computed(() => timeToPong.value),
    loading$: computed(() => loading.value),
    error$: computed(() => error.value),

    // Auto-refresh observable equivalent
    timeToPongRefresh$: computed(() => timeToPong.value),

    // Public getters for immediate values
    currentPingAmount: computed(() => pingAmount.value),
    currentTimeToPong: computed(() => timeToPong.value),
    isLoading: computed(() => loading.value),

    // Methods
    sendPingTransaction,
    sendPongTransaction,
    signAndSendTransactions,
    getPendingTransactions: getPendingSignedTransactions,
    refreshTimeToPong,
    clearError
  };
}
