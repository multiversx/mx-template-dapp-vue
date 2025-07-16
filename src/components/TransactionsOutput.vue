<template>
  <div class="flex flex-col gap-4">
    <TransactionOutput
      v-for="transaction in transactions"
      :key="transaction.hash"
      :transaction="transaction"
    />
  </div>
</template>

<script setup lang="ts">
import TransactionOutput, {
  type SignedTransactionType
} from './TransactionOutput.vue';

interface Props {
  transactions: SignedTransactionType[];
}

withDefaults(defineProps<Props>(), {
  transactions: () => []
});
</script>
