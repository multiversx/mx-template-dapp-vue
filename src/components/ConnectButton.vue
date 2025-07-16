<template>
  <Button :class-name="className" @click="login">
    <slot>Connect</slot>
  </Button>
</template>

<script setup lang="ts">
import { UnlockPanelManager } from '@multiversx/sdk-dapp/out/managers/UnlockPanelManager';
import { useRouter } from 'vue-router';
import Button from './Button.vue';

interface Props {
  className?: string;
}

withDefaults(defineProps<Props>(), {
  className:
    'inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 bg-blue-600 text-white hover:bg-blue-700 mr-0'
});

const router = useRouter();

function login() {
  const unlockPanelManager = UnlockPanelManager.init({
    loginHandler: () => {
      router.push('/dashboard');
    },
    onClose: () => {}
  });
  unlockPanelManager.openUnlockPanel();
}
</script>
