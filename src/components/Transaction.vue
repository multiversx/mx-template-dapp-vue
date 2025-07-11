<template>
  <div class="flex flex-col gap-2 text-sm">
    <a
      :href="transactionUrl"
      class="self-start inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 bg-transparent hover:bg-blue-600 text-blue-600 hover:text-white mr-0 border-solid border-blue-600 border-[1px]"
    >
      Send transaction
    </a>

    <p v-if="txData.status">
      <Label>Transaction status:</Label> {{ txData.status }}
    </p>
    <p v-if="txData.address">
      <Label>Sender:</Label> {{ txData.address }}
    </p>
    <p v-if="txData.txHash">
      <Label>Hash:</Label>
      <MxLink
        :to="`/transactions/${txData.txHash}`"
        className="border-b border-dotted border-gray-500 hover:border-solid hover:border-gray-800"
      >
        {{ txData.txHash }}
      </MxLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEnvironment } from '../composables/useEnvironment';
import Label from './Label.vue';
import MxLink from './MxLink.vue';

const route = useRoute();
const router = useRouter();
const { network } = useEnvironment();

const parseAmount = (amount: string) => {
  return (parseFloat(amount) * Math.pow(10, 18)).toString();
};

const getTransactionUrl = (walletAddress: string) => {
  const walletBaseUrl = `${walletAddress}/hook/transaction`;

  const receiver = 'erd1deaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaqtv0gag';
  const data = 'Hello_world';
  const value = parseAmount('0.01');
  const callbackUrl = encodeURIComponent(window.location.origin);
  const gasLimit = '116500';

  const searchParams = {
    receiver,
    value,
    data,
    callbackUrl,
    gasLimit
  };

  const search = new URLSearchParams(searchParams).toString();
  return `${walletBaseUrl}?${search}`;
};

const transactionUrl = computed(() => {
  return getTransactionUrl(network.value.walletAddress);
});

const txData = computed(() => ({
  status: route.query.status as string || null,
  txHash: route.query.txHash as string || null,
  address: route.query.address as string || null
}));

// Reset search params after transaction is completed
watch(
  () => txData.value,
  (newTxData) => {
    if (newTxData.status && newTxData.address) {
      // Clear query parameters
      router.replace({ query: {} });
    }
  },
  { deep: true }
);
</script> 