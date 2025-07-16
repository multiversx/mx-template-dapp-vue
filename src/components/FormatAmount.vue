<template>
  <span :class="className" :data-testid="dataTestId">
    <span class="amount-integer">{{ valueInteger }}</span
    ><span v-if="valueDecimal" class="amount-decimal">.{{ valueDecimal }}</span>
    <span v-if="showLabel" class="amount-label"> {{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';

interface Props {
  value: string;
  className?: string;
  dataTestId?: string;
  showLabel?: boolean;
  egldLabel?: string;
  digits?: number;
  decimals?: number;
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  showLabel: true,
  egldLabel: 'EGLD',
  digits: 4,
  decimals: 18,
  className: undefined,
  dataTestId: undefined
});

const isValid = ref(true);
const valueDecimal = ref('');
const valueInteger = ref('');
const label = ref('');

const updateFormattedData = () => {
  try {
    const amount = props.value || '0';
    const numericValue = parseFloat(amount);
    isValid.value = !isNaN(numericValue) && isFinite(numericValue);

    if (isValid.value && numericValue > 0) {
      const actualValue = numericValue / Math.pow(10, props.decimals);
      const formatted = actualValue.toFixed(props.digits);
      const parts = formatted.split('.');

      valueInteger.value = parts[0] || '0';
      valueDecimal.value = parts[1] || '';
      label.value = props.egldLabel;
    } else {
      valueInteger.value = '0';
      valueDecimal.value = '';
      label.value = props.egldLabel;
    }
  } catch (error) {
    console.error('Error formatting amount:', error);
    isValid.value = false;
    valueDecimal.value = '';
    valueInteger.value = props.value || '0';
    label.value = props.egldLabel;
  }
};

// Watch for changes in props
watch(() => props.value, updateFormattedData, { immediate: true });
watch(() => props.decimals, updateFormattedData);
watch(() => props.digits, updateFormattedData);
watch(() => props.egldLabel, updateFormattedData);
</script>

<style scoped>
.amount-integer {
  font-weight: 600;
  color: inherit;
}

.amount-decimal {
  font-weight: 400;
  color: inherit;
  opacity: 0.8;
}

.amount-label {
  font-weight: 500;
  color: inherit;
  opacity: 0.7;
  font-size: 0.9em;
  margin-left: 0.25rem;
}
</style>
