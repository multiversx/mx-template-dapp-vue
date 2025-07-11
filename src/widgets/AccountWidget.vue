<template>
  <OutputContainer :isLoading="isLoading">
    <div class="flex flex-col text-black" data-testid="topInfo">
      <p class="truncate">
        <Label>Address: </Label>
        <span data-testid="accountAddress">{{ address }}</span>
      </p>

      <p>
        <Label>Shard: </Label> {{ shard }}
      </p>

      <p>
        <Label>Balance: </Label>
        <span data-testid="balance">{{ balance }}</span>
      </p>

      <p>
        <Label>Nonce: </Label> {{ nonce }}
      </p>
    </div>
  </OutputContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import { getStore } from '@multiversx/sdk-dapp/out/store/store';
import OutputContainer from '../components/OutputContainer.vue';
import Label from '../components/Label.vue';

const address = ref('');
const balance = ref('');
const shard = ref(0);
const nonce = ref(0);
const isLoading = ref(true);

let storeUnsubscribe: (() => void) | undefined;

function updateAccount() {
  const account = getAccount();
  
  if (account) {
    address.value = account.address;
    balance.value = account.balance.toString();
    shard.value = account.shard || 0;
    nonce.value = account.nonce || 0;
    isLoading.value = false;
  }
}

onMounted(() => {
  // Initial load
  updateAccount();

  // Subscribe to store changes
  const store = getStore();
  storeUnsubscribe = store.subscribe(() => {
    updateAccount();
  });
});

onUnmounted(() => {
  if (storeUnsubscribe) {
    storeUnsubscribe();
  }
});
</script> 