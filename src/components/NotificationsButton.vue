<template>
  <Button
    :class-name="'inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 text-gray-600 hover:bg-slate-100 mx-0'"
    @click="handleOpenNotificationsFeed"
  >
    <FontAwesomeIcon :icon="faBell" />
  </Button>
</template>

<script setup lang="ts">
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { NotificationsFeedManager } from '@multiversx/sdk-dapp/out/managers/NotificationsFeedManager';
import Button from './Button.vue';

async function handleOpenNotificationsFeed() {
  await NotificationsFeedManager.getInstance().openNotificationsFeed();
}
</script>
