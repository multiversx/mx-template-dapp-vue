<template>
  <OutputContainer :is-loading="isLoading">
    <div class="flex flex-col text-black" data-testid="topInfo">
      <div class="flex">
        <Label>Address: </Label>
        <MvxExplorerLink
          :link="accountAddressLink"
          target="_blank"
          class="text-blue-600 hover:underline flex gap-0.5 items-center ml-1"
        >
          {{ address }}</MvxExplorerLink
        >
      </div>

      <p><Label>Shard: </Label> {{ shard }}</p>

      <p>
        <Label>Balance: </Label>
        <FormatAmount
          :value="balance"
          :show-label="balance !== '0'"
          :egld-label="label"
          data-testid="balance"
        />
      </p>

      <p><Label>Nonce: </Label> {{ nonce }}</p>
    </div>
  </OutputContainer>
</template>

<script setup lang="ts">
import { getAccount } from '@multiversx/sdk-dapp/out/methods/account/getAccount';
import { getNetworkConfig } from '@multiversx/sdk-dapp/out/methods/network/getNetworkConfig';
import { getStore } from '@multiversx/sdk-dapp/out/store/store';
import { MvxExplorerLink } from '@multiversx/sdk-dapp-ui/vue';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import FormatAmount from '@/components/FormatAmount.vue';
import Label from '../components/Label.vue';
import OutputContainer from '../components/OutputContainer.vue';

const address = ref('');
const balance = ref('');
const shard = ref(0);
const nonce = ref(0);
const isLoading = ref(true);
const label = ref('');

let storeUnsubscribe: (() => void) | undefined;
const networkConfig = getNetworkConfig();

const accountAddressLink = computed(() => {
  return `${networkConfig.network.explorerAddress}/accounts/${address.value}`;
});

function updateAccount() {
  const account = getAccount();
  const { network } = getNetworkConfig();

  if (account) {
    address.value = account.address;
    balance.value = account.balance.toString();
    shard.value = account.shard || 0;
    nonce.value = account.nonce || 0;
    isLoading.value = false;
    label.value = network.egldLabel;
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
