<script setup lang="ts">
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-200">
    <Header />
    <main class="flex flex-grow items-stretch justify-center p-6">
      <router-view />
    </main>
    <Footer />
  </div>
</template>
