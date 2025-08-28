<script setup lang="ts">
import type { Product } from '@/api/types'
import { RouterLink } from 'vue-router'
import { useCart } from '@/stores/cart'
import {computed} from "vue";
import { useRouter } from 'vue-router'

const props = defineProps<{ product: Product }>()
const router = useRouter()
const cart = useCart()
const addToCart = () => {
  if (!inCart.value) {
    cart.add(props.product.id, 1, {
      name: props.product.name,
      price: props.product.price,
      image: props.product.image,
      inStock: props.product.inStock
    })
  } else {
    router.push('/cart')
  }
}

const inCart = computed(() =>
    cart.items.some(i => i.productId === props.product.id)
)
</script>

<template>
  <div class="bg-white rounded-xl shadow p-3 flex flex-col">
    <RouterLink :to="`/product/${product.id}`" class="block">
      <img :src="product.image" :alt="product.name" class="w-full h-40 object-cover rounded-lg" />
      <div class="mt-2 font-semibold">{{ product.name }}</div>
    </RouterLink>
    <div class="text-sm text-slate-500">Редкость: {{ product.rarity }}</div>
    <div class="mt-1 text-lg font-bold">${{ product.price.toFixed(2) }}</div>
    <div class="mt-2 flex items-center justify-between">
      <span :class="product.inStock ? 'text-emerald-600' : 'text-rose-600'">
        {{ product.inStock ? 'В наличии' : 'Нет в наличии' }}
      </span>
      <button
        class="px-3 py-1 rounded bg-indigo-600 text-white disabled:opacity-50"
        :disabled="!product.inStock"
        aria-label="Добавить в корзину"
        @click="addToCart">
        {{ inCart ? 'В корзине' : 'В корзину' }}
      </button>
    </div>
  </div>
</template>
