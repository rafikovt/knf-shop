<script setup lang="ts">
import { computed } from 'vue'
import { useCart } from '@/stores/cart'

const cart = useCart()
const message = computed(() => cart.notice || cart.error)
const clear = () => cart.clearNotice()
</script>

<template>
  <div v-if="message" class="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg max-w-sm">
    <div class="flex items-start gap-2">
      <div class="font-medium">Уведомление</div>
      <button class="ml-auto text-slate-300 hover:text-white" aria-label="Закрыть" @click="clear">✕</button>
    </div>
    <div class="text-sm mt-1">{{ message }}</div>
  </div>
</template>
