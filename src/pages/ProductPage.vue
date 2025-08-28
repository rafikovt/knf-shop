<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api/http'
import type { Product } from '@/api/types'
import { useCart } from '@/stores/cart'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = String(route.params.id)
const loading = ref(true)
const error = ref('')
const product = ref<Product | null>(null)

const cart = useCart()

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    product.value = await api.get(`/products/${id}`)
  } catch (e: any) {
    error.value = e?.message ?? 'Failed to load'
  } finally {
    loading.value = false
  }
}

const add = () => {
  if (inCart.value) {
    router.push('/cart')
  } else if (product.value) cart.add(product.value.id, 1, {
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
    inStock: product.value.inStock
  })
}

const inCart = computed(() =>
    cart.items.some(i => i.productId === product.value?.id)
)

onMounted(load)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <div v-if="loading" class="h-72 bg-white rounded-xl shadow animate-pulse"></div>
    <div v-else-if="error" class="p-4 bg-rose-50 border border-rose-200 rounded-xl">
      Ошибка: {{ error }}
    </div>
    <div v-else-if="product" class="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row gap-6">
      <img :src="product.image" :alt="product.name" class="w-full md:w-1/2 rounded-xl object-cover" />
      <div class="flex-1 space-y-2">
        <h1 class="text-2xl font-bold">{{ product.name }}</h1>
        <div class="text-slate-500">Редкость: {{ product.rarity }}</div>
        <div class="text-emerald-700" v-if="product.inStock">В наличии</div>
        <div class="text-rose-700" v-else>Нет в наличии</div>
        <div class="text-3xl font-bold">${{ product.price.toFixed(2) }}</div>
        <button class="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50" :disabled="!product.inStock" @click="add">
          {{ inCart ? 'В корзине' : 'Добавить В корзину' }}
        </button>
        <div class="text-xs text-slate-400">Обновлено: {{ new Date(product.updatedAt).toLocaleString() }}</div>
      </div>
    </div>
  </div>
</template>
