<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import Widget from './Widget.vue';
import { type WidgetType } from '../types/widget.types';
import AccountWidget from '../widgets/AccountWidget.vue';
import PingPongRawWidget from '../widgets/PingPongRawWidget.vue';
import SignMessageWidget from '../widgets/SignMessageWidget.vue';

const WIDGETS: WidgetType[] = [
  {
    title: 'Account',
    widget: AccountWidget,
    description: 'Connected account details',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account',
  },
  {
    title: 'Ping & Pong (Manual)',
    widget: PingPongRawWidget,
    description: 'Smart Contract interactions using manually formulated transactions',
    reference: 'https://docs.multiversx.com/sdk-and-tools/indices/es-index-transactions/',
  },
  {
    title: 'Sign message',
    widget: SignMessageWidget,
    description: 'Message signing using the connected account',
    reference: 'https://docs.multiversx.com/sdk-and-tools/sdk-dapp/#account-1',
  },
];

const widgets = WIDGETS;
const router = useRouter();
const { logout: authLogout } = useAuth();

async function logout() {
  await authLogout();
  router.push('/');
}
</script>

<template>
  <div class="flex flex-col gap-6 max-w-3xl w-full">
    <Widget 
      v-for="element in widgets" 
      :key="element.title"
      :widgetConfig="element"
    />
  </div>
</template>

<style scoped>
/* Add dashboard page styles here if needed */
</style> 