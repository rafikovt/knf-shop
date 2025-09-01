import { io, type Socket } from 'socket.io-client'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useCatalog } from '@/stores/catalog'
import { useCart } from '@/stores/cart'
import { useAuth } from '@/stores/auth'

export const useSocket = () => {
  const socket = ref<Socket | null>(null)
  const catalog = useCatalog()
  const cart = useCart()
  const auth = useAuth()

  const connect = () => {
    socket.value?.close()
    const s = io(import.meta.env.VITE_WS_URL, {
      transports: ['websocket'],
      query: { userId: auth.user?.id || 'guest' },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000
    })
    socket.value = s

    s.on('product.updated', (payload: any) => {
      const { id, changes } = payload.data
      catalog.applyProductPatch({ id, changes })
      cart.reflectProductUpdate({ id, changes })
    })

    s.on('cart.synced', (payload: any) => {
      cart.applyServerCart(payload.data.cart)
    })
  }

  onMounted(connect)
  watch(() => auth.user?.id, connect)

  onBeforeUnmount(() => { socket.value?.close() })

  return { socket }
}
