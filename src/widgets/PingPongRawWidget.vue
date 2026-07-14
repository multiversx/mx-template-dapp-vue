<template>
  <div class="flex flex-col gap-6">
    <!-- Loading Indicator -->
    <div v-if="viewState.isLoading" class="flex justify-center">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
      />
    </div>

    <!-- Error Message -->
    <div
      v-if="viewState.error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
    >
      {{ viewState.error }}
      <button
        class="float-right font-bold"
        aria-label="Close error"
        @click="clearError"
      >
        ×
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col gap-2">
      <div class="flex justify-start gap-2">
        <MvxButton
          :disabled="!viewState.canPing || viewState.isLoading"
          data-test-id="btnPingRaw"
          data-cy="transactionBtn"
          size="small"
          @button-click="onSendPingTransaction"
        >
          <FontAwesomeIcon :icon="faArrowUp" class="mr-1" />
          Ping
        </MvxButton>

        <MvxButton
          :disabled="
            !viewState.canPong || viewState.canPing || viewState.isLoading
          "
          data-test-id="btnPongRaw"
          data-cy="transactionBtn"
          size="small"
          @button-click="onSendPongTransaction"
        >
          <FontAwesomeIcon :icon="faArrowDown" class="mr-1" />
          Pong
        </MvxButton>
      </div>
    </div>

    <!-- Output Container -->
    <OutputContainer>
      <!-- Contract Address -->
      <div class="mb-4">
        <label class="font-semibold">Contract Address:</label>
        <MvxExplorerLink
          class="ml-1 text-sm break-all text-blue-600 hover:underline"
          target="_blank"
          :link="contractAddressLink"
        >
          {{ contractAddress }}
        </MvxExplorerLink>
      </div>

      <!-- Time Remaining -->
      <div
        v-if="!viewState.canPong && viewState.timeToPong != null"
        class="mb-4"
      >
        <label class="font-semibold">Time remaining:</label>
        <span class="ml-2 text-red-600 font-mono">{{
          viewState.timeRemaining
        }}</span>
        <span class="ml-1">until able to pong</span>
      </div>

      <!-- Pong Ready -->
      <div v-if="viewState.canPong" class="mb-4">
        <span class="text-green-600 font-semibold">Ready to pong!</span>
      </div>

      <!-- Additional Output Component -->
      <PingPongOutput
        v-if="pendingTransactions.length > 0"
        :transactions="pendingTransactions"
      />
    </OutputContainer>
  </div>
</template>

<script setup lang="ts">
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { getNetworkConfig } from '@multiversx/sdk-dapp/out/methods/network/getNetworkConfig';
import { MvxExplorerLink, MvxButton } from '@multiversx/sdk-dapp-ui/vue';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import OutputContainer from '../components/OutputContainer.vue';
import PingPongOutput from '../components/PingPongOutput.vue';
import { type SignedTransactionType } from '../components/TransactionOutput.vue';
import { usePingPong } from '../composables/usePingPong';
import { contractAddress } from '../config';
import {
  calculatePingPongState,
  formatTimeRemaining
} from '../helpers/countdown.helpers';

interface ViewState {
  timeToPong: number | null;
  timeRemaining: string;
  canPing: boolean;
  canPong: boolean;
  isLoading: boolean;
  error: string | null;
}

// Use the real ping pong service
const pingPongService = usePingPong();
const networkConfig = getNetworkConfig();

const contractAddressLink = computed(() => {
  return `${networkConfig.network.explorerAddress}/accounts/${contractAddress}`;
});

// Reactive view state computed from service
const viewState = computed<ViewState>(() => {
  const timeToPong = pingPongService.timeToPong.value;
  const pingPongState = calculatePingPongState(timeToPong);

  return {
    timeToPong,
    timeRemaining: formatTimeRemaining(timeToPong),
    canPing: pingPongState.canPing,
    canPong: pingPongState.canPong,
    isLoading: pingPongService.loading.value,
    error: pingPongService.error.value
  };
});

const pendingTransactions = ref<SignedTransactionType[]>([]);

async function onSendPingTransaction() {
  try {
    await pingPongService.sendPingTransaction();
    pendingTransactions.value = pingPongService.getPendingTransactions();
  } catch (error) {
    console.error('Error sending ping transaction:', error);
  }
}

async function onSendPongTransaction() {
  try {
    await pingPongService.sendPongTransaction();
    pendingTransactions.value = pingPongService.getPendingTransactions();
  } catch (error) {
    console.error('Error sending pong transaction:', error);
  }
}

function clearError() {
  pingPongService.clearError();
}
</script>
