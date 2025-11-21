<template>
  <MvxButton :class="className" @button-click="login">
    <slot>Connect</slot>
  </MvxButton>
</template>

<script setup lang="ts">
import { UnlockPanelManager } from '@multiversx/sdk-dapp/out/managers/UnlockPanelManager';
import { MvxButton } from '@multiversx/sdk-dapp-ui/vue';
import { useRouter } from 'vue-router';

interface Props {
  className?: string;
}

withDefaults(defineProps<Props>(), {
  className:
    'inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 text-white mr-0'
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
