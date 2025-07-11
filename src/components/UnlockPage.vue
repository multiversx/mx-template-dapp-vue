<script setup lang="ts">
// Empty script setup to match Angular component's simplicity
</script>

<template>
  <div class="flex w-full h-full flex-1 rounded-xl bg-white p-6 sm:flex-row items-center justify-center">
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
          <div class="flex flex-col gap-2 text-sm">
            <a href="https://devnet-wallet.multiversx.com/hook/transaction?receiver=erd1deaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaddeaqtv0gag&value=10000000000000000&data=Hello_world&callbackUrl=https%253A%252F%252Fdevnet.template-dapp.multiversx.com&gasLimit=116500" 
               class="self-start inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 bg-transparent hover:bg-blue-600 text-blue-600 hover:text-white mr-0 border-solid border-blue-600 border-[1px]">
              Send transaction
            </a>
          </div>
        </div>
      </div>
      <div class="h-4/6 bg-mvx-white bg-contain bg-no-repeat w-1/2 bg-center"></div>
    </div>
  </div>
</template>

<style scoped>
/* No custom styles needed - using utility classes like Angular version */
</style> 