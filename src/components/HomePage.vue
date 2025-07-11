<template>
  <div class="flex flex-col items-center justify-center min-h-60vh text-center">
    <h1 class="text-4xl font-bold mb-8">MultiversX dApp Template</h1>
    
    <div v-if="!isLoggedIn" class="space-y-6">
      <p class="text-lg text-gray-600 mb-8">
        Connect your wallet to get started with MultiversX blockchain interactions
      </p>
      
      <ConnectButton className="text-lg px-8 py-4">
        Connect Wallet
      </ConnectButton>
      
      <div class="mt-8 text-sm text-gray-500">
        <p>This demo supports Web Wallet, Extension, WalletConnect, and Ledger</p>
      </div>
    </div>
    
    <div v-else class="space-y-6">
      <p class="text-lg text-green-600 mb-4">✅ Wallet Connected!</p>
      <p class="text-gray-600 mb-8">
        Redirecting to dashboard...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import ConnectButton from './ConnectButton.vue';

const { isLoggedIn } = useAuth();
const router = useRouter();

// Redirect to dashboard when logged in
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000); // Small delay to show the success message
  }
}, { immediate: true });
</script> 