<template>
  <div
    :data-testid="dataTestId"
    :class="'text-sm border border-gray-200 rounded overflow-auto ' + className"
  >
    <div v-if="isLoading" class="flex justify-center items-center p-4">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      />
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
interface Props {
  isLoading?: boolean;
  className?: string;
  dataTestId?: string;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
  className: 'p-4',
  dataTestId: undefined
});
</script>
