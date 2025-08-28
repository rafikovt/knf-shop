<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
import Toasts from '@/components/Toasts.vue'
import { useSocket } from '@/composables/useSocket'
import { useAuth } from '@/stores/auth'
import { useCart } from '@/stores/cart'

useSocket()
const auth = useAuth()
const cart = useCart()
const router = useRouter()

const onLogout = async () => {
  await auth.logout()
  cart.reset()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white border-b">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <RouterLink to="/catalog" class="font-semibold text-indigo-700">Knife Store</RouterLink>
        <nav class="flex items-center gap-3">
          <RouterLink class="hover:underline" to="/catalog">Каталог</RouterLink>
          <RouterLink class="hover:underline" to="/cart">Корзина</RouterLink>
          <RouterLink class="hover:underline" to="/checkout">Оформление</RouterLink>
          <button v-if="auth.isAuthed" class="ml-4 px-3 py-1 rounded border" @click="onLogout">Выйти</button>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <RouterView />
    </main>

    <Toasts />
  </div>
</template>
