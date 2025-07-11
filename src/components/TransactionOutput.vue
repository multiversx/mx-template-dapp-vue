<template>
  <div class="flex flex-col" v-if="transaction">
    <p>
      <Label>Hash: </Label>
      <MxLink
        :to="'/transactions/' + transaction.hash"
        className="border-b border-dotted border-gray-500 hover:border-solid hover:border-gray-800"
      >
        {{ transaction.hash }}
      </MxLink>
    </p>

    <p>
      <Label>Receiver: </Label>
      <MxLink
        :to="'/accounts/' + transaction.receiver"
        className="border-b border-dotted border-gray-500 hover:border-solid hover:border-gray-800"
      >
        {{ transaction.receiver }}
      </MxLink>
    </p>

    <p>
      <Label>Amount: </Label>
      <FormatAmount
        :value="transaction.value"
        :showLabel="transaction.value !== '0'"
        egldLabel="EGLD"
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
import { computed } from 'vue';
import Label from './Label.vue';
import FormatAmount from './FormatAmount.vue';
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
</script> 