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
        <Button
          :disabled="!viewState.canPing || viewState.isLoading"
          data-test-id="btnPingRaw"
          data-cy="transactionBtn"
          @click="onSendPingTransaction"
        >
          <FontAwesomeIcon :icon="faArrowUp" class="mr-1" />
          Ping
        </Button>

        <Button
          :disabled="
            !viewState.canPong || viewState.canPing || viewState.isLoading
          "
          data-test-id="btnPongRaw"
          data-cy="transactionBtn"
          @click="onSendPongTransaction"
        >
          <FontAwesomeIcon :icon="faArrowDown" class="mr-1" />
          Pong
        </Button>
      </div>
    </div>

    <!-- Output Container -->
    <OutputContainer>
      <!-- Contract Address -->
      <div class="mb-4">
        <label class="font-semibold">Contract Address:</label>
        <span class="ml-2 font-mono text-sm break-all">{{
          contractAddress
        }}</span>
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
import { computed, ref, reactive, onMounted, onUnmounted } from 'vue';
import Button from '../components/Button.vue';
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

// Update time remaining countdown
let intervalId: number | undefined;

onMounted(() => {
  intervalId = window.setInterval(() => {
    // Force reactivity update for time remaining
    viewState.value; // Access to trigger computed recalculation
  }, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>
