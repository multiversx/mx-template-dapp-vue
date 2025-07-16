<template>
  <Card
    :title="widgetConfig.title"
    :description="widgetConfig.description"
    :reference="widgetConfig.reference"
    :anchor="widgetConfig.anchor"
  >
    <component :is="widgetConfig.widget" v-if="widgetConfig.widget" />
  </Card>
</template>

<script setup lang="ts">
import Card from './Card.vue';

export interface WidgetType {
  title: string;
  description?: string;
  reference: string;
  anchor?: string;
  widget?: any; // Component type
}

interface Props {
  widgetConfig: WidgetType;
}

defineProps<Props>();
</script>
