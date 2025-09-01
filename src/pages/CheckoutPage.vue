<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/api/http'
import { useCart } from '@/stores/cart'

const name = ref('John Doe')
const comment = ref('Leave at door')
const result = ref<string>('')
const error = ref<string>('')
const loading = ref(false)

const cart = useCart()

const submit = async () => {
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const res = await api.post('/checkout', {
      customer: { name: name.value, comment: comment.value },
      cart: cart.cart
    })
    result.value = `Заказ ${res.orderId} оформлен`
    cart.reset()
  } catch (e: any) {
    const err = e?.response?.data
    if (err?.error === 'CART_OUTDATED' && err.serverCart) {
      cart.applyServerCart(err.serverCart)
      error.value = 'Корзина была обновлена на сервере. Проверьте и отправьте снова.'
    } else {
      error.value = e?.message ?? 'Ошибка оформления'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto px-4 py-6">
    <template v-if="!result">
      <h1 class="text-xl font-bold mb-4">Оформление заказа</h1>

      <div class="bg-white rounded-xl shadow p-4 space-y-3">
        <input class="w-full border rounded px-3 py-2" v-model="name" placeholder="Имя" aria-label="Имя" />
        <textarea class="w-full border rounded px-3 py-2" v-model="comment" placeholder="Комментарий" aria-label="Комментарий"></textarea>
        <button class="w-full bg-indigo-600 text-white rounded px-3 py-2 disabled:opacity-50" :disabled="loading" @click="submit">
          {{ loading ? 'Отправка...' : 'Подтвердить заказ' }}
        </button>
      </div>
    </template>
    <div v-if="result" class="mt-4 p-3 rounded bg-emerald-50 border border-emerald-200">{{ result }}</div>
    <div v-if="error" class="mt-4 p-3 rounded bg-rose-50 border border-rose-200">{{ error }}</div>
  </div>
</template>
