<template>
  <div class="flex flex-col-reverse sm:flex-row items-center h-full w-full">
    <div class="flex items-start sm:items-center h-full sm:w-1/2 sm:bg-center">
      <div class="flex flex-col gap-2 max-w-[70sch] text-center sm:text-left text-xl font-medium md:text-2xl lg:text-3xl">
        <div>
          <h1>Template dApp</h1>
          <p class="text-gray-400">
            The 
            <a href="https://www.npmjs.com/package/@multiversx/sdk-dapp" 
               target="_blank" 
               class="text-gray-400 underline decoration-dotted hover:decoration-solid">
              sdk-dapp
            </a> 
            starter project for any dApp 
            <br class="hidden xl:block">
            built on the 
            <a href="https://multiversx.com/" 
               target="_blank" 
               class="text-gray-400 underline decoration-dotted hover:decoration-solid">
              MultiversX
            </a> 
            blockchain.
          </p>
        </div>
        <Transaction />
      </div>
    </div>
    <div class="h-4/6 bg-mvx-white bg-contain bg-no-repeat w-1/2 bg-center"></div>
  </div>
</template>

<script setup lang="ts">
import Transaction from './Transaction.vue';
</script> 