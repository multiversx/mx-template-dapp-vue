<template>
  <Button
    @click="handleOpenNotificationsFeed"
    :className="'inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 text-gray-600 hover:bg-slate-100 mx-0'"
  >
    <font-awesome-icon :icon="faBell" />
  </Button>
</template>

<script setup lang="ts">
import { NotificationsFeedManager } from '@multiversx/sdk-dapp/out/managers/NotificationsFeedManager';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Button from './Button.vue';

async function handleOpenNotificationsFeed() {
  await NotificationsFeedManager.getInstance().openNotificationsFeed();
}
</script> 