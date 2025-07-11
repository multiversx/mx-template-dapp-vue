<template>
  <div
    class="flex flex-col flex-1 rounded-xl bg-white p-6 justify-center"
    :data-testid="dataTestId"
    :id="anchor"
  >
    <h2 class="flex text-xl font-medium group">
      {{ title }}
      <a
        :href="reference"
        target="_blank"
        class="hidden group-hover:block ml-2 text-blue-600"
      >
        <span class="text-sm">ℹ️</span>
      </a>
    </h2>
    <p v-if="description" class="text-gray-400 mb-6">{{ description }}</p>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  reference: string;
  anchor?: string;
  dataTestId?: string;
}

defineProps<Props>();
</script> 