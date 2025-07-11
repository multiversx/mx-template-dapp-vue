<template>
  <header class="flex flex-row align-center justify-between pl-6 pr-6 pt-6">
    <MxLink
      :class="'flex items-center justify-between'"
      :to="isLoggedIn ? routeNames.dashboard : routeNames.home"
    >
      <img src="../assets/logo.svg" alt="MultiversX" class="w-full h-6" />
    </MxLink>

    <nav class="h-full w-full text-sm sm:relative sm:left-auto sm:top-auto sm:flex sm:w-auto sm:flex-row sm:justify-end sm:bg-transparent">
      <div class="flex justify-end container mx-auto items-center gap-2">
        <div class="flex gap-1 items-center">
          <div class="w-2 h-2 rounded-full bg-green-500"></div>
          <p class="text-gray-600">{{ environment }}</p>
        </div>

        <template v-if="isLoggedIn">
          <NotificationsButton />
          <Button
            @click="handleLogout"
            :className="'inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 text-gray-600 hover:bg-slate-100 mx-0'"
          >
            Close
          </Button>
        </template>

        <ConnectButton v-else>
          Connect
        </ConnectButton>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useEnvironment } from '../composables/useEnvironment';
import MxLink from './MxLink.vue';
import Button from './Button.vue';
import NotificationsButton from './NotificationsButton.vue';
import ConnectButton from './ConnectButton.vue';

// Route names
const routeNames = {
  dashboard: '/dashboard',
  home: '/'
};

// Use composables for real auth and environment state
const { isLoggedIn, logout } = useAuth();
const { environment } = useEnvironment();
const router = useRouter();

async function handleLogout() {
  await logout();
  router.push(routeNames.home);
}
</script> 