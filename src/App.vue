<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';

const route = useRoute();

const shouldWrapInPageWrapper = computed(() => {
  return route.path === '/';
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-200">
    <Header />
    <main class="flex flex-grow items-stretch justify-center p-6">
      <div
        v-if="shouldWrapInPageWrapper"
        class="flex flex-1 rounded-xl bg-white p-6 sm:flex-row items-center justify-center"
      >
        <router-view />
      </div>
      <router-view v-else />
    </main>
    <Footer />
  </div>
</template>
