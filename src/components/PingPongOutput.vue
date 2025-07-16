<template>
  <div>
    <TransactionsOutput
      v-if="transactions && transactions.length > 0"
      :transactions="transactions"
    />
  </div>
</template>

<script setup lang="ts">
import TransactionsOutput from './TransactionsOutput.vue';
import { contractAddress } from '../config';
import { type SignedTransactionType } from './TransactionOutput.vue';

interface Props {
  transactions?: SignedTransactionType[] | null;
}

withDefaults(defineProps<Props>(), {
  transactions: null
});

// Contract address from config - now properly imported
const contractAddressFromConfig = contractAddress;
</script>
