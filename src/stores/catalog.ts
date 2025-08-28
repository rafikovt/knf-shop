import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api/http'
import type { Product } from '@/api/types'

export const useCatalog = defineStore('catalog', () => {
  const items = ref<Product[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const loading = ref(false)
  const error = ref<string>('')

  const fetchList = async (params: Record<string, any>) => {
    loading.value = true
    error.value = ''
    try {
      const r = await api.get('/products', { params })
      items.value = r.items
      total.value = r.total
      page.value = r.page
      limit.value = r.limit
    } catch (e: any) {
      error.value = e?.message ?? 'Failed to load'
    } finally {
      loading.value = false
    }
  }

  const applyProductPatch = (patch: { id: string; changes: Partial<Product> }) => {
    const idx = items.value.findIndex(p => p.id === patch.id)
    if (idx !== -1) items.value[idx] = { ...items.value[idx], ...patch.changes }
  }

  const reset = () => {
    items.value = []
    total.value = 0
    page.value = 1
    limit.value = 20
    loading.value = false
    error.value = ''
  }

  return { items, total, page, limit, loading, error, fetchList, applyProductPatch, reset }
})
