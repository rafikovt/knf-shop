<script setup lang="ts">
const props = defineProps<{ modelValue: number }>()
const emit = defineEmits(['update:modelValue'])
const inc = () => emit('update:modelValue', props.modelValue + 1)
const dec = () => emit('update:modelValue', Math.max(1, props.modelValue - 1))
</script>

<template>
  <div class="inline-flex items-center gap-1">
    <button class="px-2 py-1 border rounded" @click="dec" aria-label="Уменьшить">-</button>
    <input class="w-14 border rounded px-2 py-1 text-center" :value="props.modelValue" readonly aria-label="Количество" />
    <button class="px-2 py-1 border rounded" @click="inc" aria-label="Увеличить">+</button>
  </div>
</template>
