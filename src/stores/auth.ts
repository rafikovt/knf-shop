import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api/http'

type User = { id: string; nickname: string; avatar: string } | null

export const useAuth = defineStore('auth', () => {
  const token = ref<string>('')
  const user = ref<User>(null)

  const isAuthed = computed(() => !!token.value && !!user.value)

  const login = async (nickname = 'User', pass = '') => {
    const r = await api.post('/auth/login', { provider: 'mock', nickname, pass })
    token.value = r.token
    user.value = r.user
  }

  const logout = async () => {
    try { await api.post('/auth/logout', {}) } catch {}
    reset()
  }

  const reset = () => {
    token.value = ''
    user.value = null
  }

  return { token, user, isAuthed, login, logout, reset }
}, {
  persist: {
    key: 'auth',
    paths: ['token','user'],
  },
})
