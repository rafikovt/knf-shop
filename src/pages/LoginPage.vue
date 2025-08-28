<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const auth = useAuth()
const router = useRouter()

const nickname = ref('User')
const pass = ref('')

const submit = async () => {
  await auth.login(nickname.value, pass.value)
  router.push('/catalog')
}
</script>

<template>
  <div class="max-w-md mx-auto mt-20 bg-white rounded-2xl shadow p-6">
    <h1 class="text-xl font-bold mb-4">Вход</h1>
    <div class="space-y-3">
      <input class="w-full border rounded px-3 py-2" v-model="nickname" placeholder="Никнейм" />
      <input class="w-full border rounded px-3 py-2" v-model="pass" placeholder="password" />
      <button class="w-full bg-indigo-600 text-white rounded px-3 py-2" @click="submit">Войти</button>
    </div>
  </div>
</template>
