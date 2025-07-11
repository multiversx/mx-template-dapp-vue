<template>
  <Card
    :title="widgetConfig.title"
    :description="widgetConfig.description"
    :reference="widgetConfig.reference"
    :anchor="widgetConfig.anchor"
  >
    <component
      v-if="widgetConfig.widget"
      :is="widgetConfig.widget"
    />
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