<template>
  <router-link :to="to" :class="className">
    <slot />
  </router-link>
</template>

<script setup lang="ts">
interface Props {
  to: string;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  className:
    'inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 text-blue-600 text-white hover:text-blue-700 ml-2 mr-0'
});
</script>
