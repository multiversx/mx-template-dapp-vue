<template>
  <footer class="mx-auto w-full max-w-prose pb-6 pl-6 pr-6 text-center text-gray-400">
    <div class="flex flex-col items-center text sm text-gray-400">
      <router-link
        class="text-gray-400 text-sm hover:cursor-pointer hover:underline"
        to="/disclaimer"
      >
        Disclaimer
      </router-link>
      <a
        target="_blank"
        class="flex items-center text-sm hover:underline"
        href="https://multiversx.com/"
      >
        Made with
        <span class="mx-1">❤️</span>
        by the MultiversX team
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No script needed for static footer
</script> 