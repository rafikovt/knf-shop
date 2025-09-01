<!-- web/src/pages/CartPage.vue -->
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useCart } from '@/stores/cart'
import QtyInput from '@/components/QtyInput.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cart = useCart()
onMounted(() => cart.load())

const needsConfirm = (pid: string) => cart.uxFlags[pid]?.status === 'price'
const newPrice = (pid: string) => cart.uxFlags[pid]?.newPrice
const goCheckout = () => {
  router.push('/checkout')
}

</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <h1 class="text-xl font-bold mb-3">Корзина</h1>

    <div v-if="!cart.items.length" class="p-4 bg-white rounded-xl shadow">Корзина пуста</div>

    <div v-else class="space-y-3">
      <div
          v-for="it in cart.items"
          :key="it.productId"
          class="bg-white rounded-xl shadow p-3 flex flex-col gap-3"
          :class="{
            'border-2 border-red-500': cart.uxFlags[it.productId]?.status === 'out',
            'border-2 border-amber-500': cart.uxFlags[it.productId]?.status === 'price'
         }"
          @animationend="cart.clearHighlight(it.productId)"
      >
        <div class="flex items-center gap-3">
          <img :src="it.image" class="w-20 h-16 object-cover rounded" />
          <div class="flex-1">
            <div class="font-semibold">{{ it.name || it.productId }}</div>
            <div class="text-sm text-slate-500">
              ${{ it.price.toFixed(2) }} за шт.
              <span v-if="!it.inStock" class="ml-2 text-rose-600">Нет в наличии</span>
            </div>
          </div>

          <QtyInput :model-value="it.qty" @update:modelValue="v => cart.update(it.productId, v)" />
          <div class="w-28 text-right font-bold">${{ (it.price * it.qty).toFixed(2) }}</div>

          <button
              class="text-rose-600 hover:underline disabled:opacity-50"
              :disabled="cart.pending"
              @click="cart.remove(it.productId)"
          >
            Удалить
          </button>
        </div>

        <div v-if="needsConfirm(it.productId)" class="rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-center gap-3">
          <div class="text-sm">
            Цена изменилась до <b>${{ newPrice(it.productId)?.toFixed?.(2) ?? newPrice(it.productId) }}</b>.
            Подтвердите пересчёт.
          </div>
          <button
              class="ml-auto px-3 py-1 rounded bg-amber-600 text-white disabled:opacity-50"
              :disabled="cart.pending"
              @click="cart.confirmReprice(it.productId)"
          >
            Подтвердить
          </button>
        </div>
      </div>

      <div class="text-right text-lg">
        Итого: <span class="font-bold">${{ cart.subtotal.toFixed(2) }}</span> {{ cart.currency }}
      </div>
      <button
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          :disabled="!cart.items.length"
          @click="goCheckout"
      >
        Оформить заказ
      </button>
    </div>
  </div>
</template>

<style scoped>
.ring-amber-300 { transition: box-shadow .2s ease; }
</style>
