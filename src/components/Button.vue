<template>
  <button
    :id="id"
    :disabled="disabled"
    :class="className"
    :type="type"
    :data-testid="dataTestId"
    :data-cy="dataCy"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
  className?: string;
  dataTestId?: string;
  dataCy?: string;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  type: 'button',
  className:
    'inline-block rounded-lg px-3 py-2 text-center hover:no-underline my-0 bg-blue-600 text-white hover:bg-blue-700 mr-0 disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed',
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>
