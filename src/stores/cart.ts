// web/src/stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api/http'
import type { Cart } from '@/api/types'

type UXItemFlags = {
  productId: string
  status?: 'out' | 'price'   // out = нет в наличии, price = изменилась цена
  highlight?: boolean
  newPrice?: number
}

export const useCart = defineStore('cart', () => {
  const cart = ref<Cart | null>(null)
  const loading = ref(false)
  const error = ref('')
  const notice = ref('')
  const pending = ref(false)             // блокируем кнопки на время запроса
  const uxFlags = ref<Record<string, UXItemFlags>>({})

  const items = computed(() => cart.value?.items ?? [])
  const subtotal = computed(() => cart.value?.subtotal ?? 0)
  const currency = computed(() => cart.value?.currency ?? 'USD')

  const load = async () => {
    cart.value = await api.get('/cart')
  }

  // helper: безопасный клон простых данных
  const clone = <T,>(v: T) => (v ? JSON.parse(JSON.stringify(v)) as T : v)

  // оптимистичное добавление
  const add = async (productId: string, qty = 1, meta?: { name: string; price: number; image: string; inStock: boolean }) => {
    pending.value = true
    const snapshot = clone(cart.value)
    ensureCart()

    const ex = cart.value!.items.find(i => i.productId === productId)
    if (ex) ex.qty += qty
    else cart.value!.items.push({
      productId,
      name: meta?.name || productId,
      price: meta?.price ?? 0,
      qty,
      image: meta?.image || '',
      inStock: meta?.inStock ?? true
    })

    try {
      cart.value = await api.post('/cart/add', { productId, qty })
    } catch (e: any) {
      cart.value = snapshot
      error.value = e?.response?.data?.error || 'ADD_FAILED'
    } finally {
      pending.value = false
    }
  }

  // оптимистичное изменение количества
  const update = async (productId: string, qty: number) => {
    pending.value = true
    const snapshot = clone(cart.value)
    const it = cart.value?.items.find(i => i.productId === productId)
    if (it) it.qty = qty

    try {
      cart.value = await api.post('/cart/update', { productId, qty })
      // при успехе сбросим флаги подтверждения для этого товара
      delete uxFlags.value[productId]
    } catch (e: any) {
      const err = e?.response?.data
      if (err?.error === 'PRICE_CHANGED') {
        // показываем подтверждение новой цены
        uxFlags.value[productId] = {
          productId,
          needsConfirm: true,
          highlight: true,
          newPrice: err.newPrice,
        }
        notice.value = `Цена изменилась до ${err.newPrice}. Подтвердите пересчёт.`
      } else if (err?.error === 'OUT_OF_STOCK') {
        uxFlags.value[productId] = { productId, highlight: true }
        notice.value = 'Товар недоступен. Удалите или замените позицию.'
      } else {
        error.value = err?.error || 'UPDATE_FAILED'
      }
      cart.value = snapshot
    } finally {
      pending.value = false
    }
  }

  // оптимистичное удаление
  const remove = async (productId: string) => {
    pending.value = true
    const snapshot = clone(cart.value)
    if (cart.value) cart.value.items = items.value.filter(i => i.productId !== productId)
    try {
      cart.value = await api.post('/cart/remove', { productId })
      delete uxFlags.value[productId]
    } catch {
      cart.value = snapshot
    } finally {
      pending.value = false
    }
  }

  // подтверждаем новую цену после PRICE_CHANGED
  const confirmReprice = async (productId: string) => {
    const f = uxFlags.value[productId]
    if (!f?.newPrice) { delete uxFlags.value[productId]; return }
    // поднимаем qty из текущей позиции (оставляем как есть)
    const it = items.value.find(i => i.productId === productId)
    if (!it) { delete uxFlags.value[productId]; return }
    // пробуем ещё раз апдейт с тем же qty (сервер отдаст уже новую цену)
    await update(productId, it.qty)
    delete uxFlags.value[productId]
    notice.value = 'Цена обновлена.'
  }

  // пришло по WebSocket: обновить инсток/цену
  const reflectProductUpdate = ({ id, changes }: { id: string; changes: Partial<{ price: number; inStock: boolean }> }) => {
    const it = items.value.find(i => i.productId === id)
    if (!it) return

    if (typeof changes.inStock === 'boolean') {
      it.inStock = changes.inStock
      if (!changes.inStock) {
        uxFlags.value[id] = { productId: id, status: 'out', highlight: true }
        notice.value = 'Некоторые товары недоступны. Проверьте корзину.'
      }
    }

    if (typeof changes.price === 'number' && changes.price !== it.price) {
      uxFlags.value[id] = { productId: id, status: 'price', highlight: true, newPrice: changes.price }
      notice.value = 'Цена товара в корзине изменилась. Подтвердите.'
    }
  }

  const clearHighlight = (productId: string) => {
    if (uxFlags.value[productId]) uxFlags.value[productId].highlight = false
  }

  const applyServerCart = (next: Cart) => {
    cart.value = next
    notice.value = 'Корзина обновлена'
    // сбросим все флаги
    uxFlags.value = {}
  }

  const clearNotice = () => { notice.value = '' }

  const reset = () => {
    cart.value = null
    loading.value = false
    error.value = ''
    notice.value = ''
    pending.value = false
    uxFlags.value = {}
  }

  const ensureCart = () => {
    if (!cart.value) {
      cart.value = {
        items: [],
        subtotal: 0,
        currency: 'USD',
        updatedAt: new Date().toISOString(),
      }
    }
  }

  return {
    cart, items, subtotal, currency,
    loading, error, notice, pending, uxFlags,
    load, add, update, remove, confirmReprice,
    applyServerCart, reflectProductUpdate,
    clearNotice, clearHighlight, reset,
  }
})
