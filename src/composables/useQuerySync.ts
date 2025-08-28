import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export const useQuerySync = <T extends Record<string, any>>(defaults: T) => {
  const route = useRoute()
  const router = useRouter()
  const state = ref<T>({ ...defaults, ...(route.query as any) })

  watch(state, (val) => {
    router.replace({ query: { ...val } })
  }, { deep: true })

  return state
}
