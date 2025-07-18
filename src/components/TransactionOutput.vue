<template>
  <div v-if="transaction" class="flex flex-col">
    <p>
      <Label>Hash: </Label>
      <a
        :href="hashExplorerLink"
        target="_blank"
        rel="noopener noreferrer"
        className="border-b border-dotted border-gray-500 hover:border-solid hover:border-gray-800"
      >
        {{ transaction.hash }}
      </a>
    </p>

    <p>
      <Label>Receiver: </Label>
      <MxLink
        :to="receiverExplorerLink"
        target="_blank"
        rel="noopener noreferrer"
        class-name="border-b border-dotted border-gray-500 hover:border-solid hover:border-gray-800"
      >
        {{ transaction.receiver }}
      </MxLink>
    </p>

    <p>
      <Label>Amount: </Label>
      <FormatAmount
        :value="transaction.value"
        :show-label="transaction.value !== '0'"
        :egld-label="label"
        data-testid="balance"
      />
    </p>

    <p>
      <Label>Gas price: </Label>
      {{ transaction.gasPrice }}
    </p>

    <p>
      <Label>Gas limit: </Label>
      {{ transaction.gasLimit }}
    </p>

    <p class="whitespace-nowrap">
      <Label>Data: </Label>
      {{ decodedData }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { getNetworkConfig } from '@multiversx/sdk-dapp/out/methods/network/getNetworkConfig';
import { getExplorerLink } from '@multiversx/sdk-dapp/out/utils/transactions/getExplorerLink';
import { computed, onMounted, ref } from 'vue';
import FormatAmount from './FormatAmount.vue';
import Label from './Label.vue';
import MxLink from './MxLink.vue';

export interface SignedTransactionType {
  hash: string;
  receiver: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  data?: string;
}

interface Props {
  transaction?: SignedTransactionType;
}

const props = defineProps<Props>();

const label = ref('');
const explorerAddress = ref('');

onMounted(() => {
  const { network } = getNetworkConfig();
  label.value = network.egldLabel;
  explorerAddress.value = network.explorerAddress;
});

const decodedData = computed(() => {
  if (!props.transaction?.data) {
    return 'N/A';
  }

  try {
    return Buffer.from(props.transaction.data, 'base64').toString('ascii');
  } catch {
    return 'N/A';
  }
});

const hashExplorerLink = computed(() => {
  if (!props.transaction?.hash) {
    return '';
  }

  return getExplorerLink({
    to: `/transactions/${props.transaction.hash}`,
    explorerAddress: explorerAddress.value
  });
});

const receiverExplorerLink = computed(() => {
  if (!props.transaction?.receiver) {
    return '';
  }
  return getExplorerLink({
    to: `/accounts/${props.transaction.receiver}`,
    explorerAddress: explorerAddress.value
  });
});
</script>
