<template>
  <div>
    <TransactionsOutput
      v-if="transactions && transactions.length > 0"
      :transactions="transactions"
    />
  </div>
</template>

<script setup lang="ts">
import { type SignedTransactionType } from './TransactionOutput.vue';
import TransactionsOutput from './TransactionsOutput.vue';

interface Props {
  transactions?: SignedTransactionType[] | null;
}

withDefaults(defineProps<Props>(), {
  transactions: null
});
</script>
