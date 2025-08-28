<script setup lang="ts">
import {computed } from 'vue'
const props = defineProps<{ page: number; limit: number; total: number }>()
const emit = defineEmits(['update:page'])

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.limit)))
</script>

<template>
  <div class="flex items-center justify-center gap-2 my-4">
    <button class="px-3 py-1 rounded border" :disabled="props.page<=1" @click="emit('update:page', props.page-1)">Назад</button>
    <span>Стр. {{ props.page }} / {{ totalPages }}</span>
    <button class="px-3 py-1 rounded border" :disabled="props.page>=totalPages" @click="emit('update:page', props.page+1)">Вперёд</button>
  </div>
</template>
