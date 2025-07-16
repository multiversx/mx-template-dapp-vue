<template>
  <div
    class="flex flex-col items-center justify-center min-h-60vh text-center max-w-2xl mx-auto p-6"
  >
    <h1 class="text-3xl font-bold mb-6">Disclaimer</h1>

    <div class="text-left space-y-4 text-gray-700">
      <p>
        This is a demonstration application built with the MultiversX SDK for
        educational and development purposes.
      </p>

      <p>
        <strong>Important:</strong> This application is provided "as is" without
        warranty of any kind. Use at your own risk. Always verify transactions
        before signing.
      </p>

      <p>
        The developers of this application are not responsible for any loss of
        funds or other damages that may result from using this software.
      </p>

      <p>
        This template demonstrates basic MultiversX blockchain interactions
        including:
      </p>

      <ul class="list-disc list-inside ml-4 space-y-1">
        <li>Wallet connection and authentication</li>
        <li>Account information display</li>
        <li>Message signing</li>
        <li>Smart contract interactions</li>
        <li>Transaction management</li>
      </ul>

      <p>
        Always test on testnet before using on mainnet. Never share your private
        keys or seed phrases.
      </p>
    </div>

    <div class="mt-8">
      <router-link
        to="/"
        class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script logic needed for static disclaimer page
</script>
