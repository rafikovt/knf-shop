<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useCatalog } from '@/stores/catalog'
import { useQuerySync } from '@/composables/useQuerySync'
import ProductCard from '@/components/ProductCard.vue'
import FiltersBar from '@/components/FiltersBar.vue'
import Pagination from '@/components/Pagination.vue'
import { useDebounceFn } from '@vueuse/core'

const catalog = useCatalog()

const q = useQuerySync({
  q: '',
  min: '',
  max: '',
  inStock: '',
  rarity: '',
  sort: '',
  page: 1,
  limit: 20
})

const load = useDebounceFn(() => catalog.fetchList(q.value), 300)

onMounted(load)
watch(q, load, { deep: true })
watch(
    () => [q.value.q, q.value.min, q.value.max, q.value.inStock, q.value.rarity, q.value.sort],
    () => { q.value.page = 1 }
)
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <FiltersBar
      :q="q.q"
      :min="q.min"
      :max="q.max"
      :inStock="q.inStock"
      :rarity="q.rarity"
      :sort="q.sort"
      @update:q="q.q = $event"
      @update:min="q.min = $event"
      @update:max="q.max = $event"
      @update:inStock="q.inStock = $event"
      @update:rarity="q.rarity = $event"
      @update:sort="q.sort = $event"
    />

    <div v-if="catalog.loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="h-64 rounded-xl shadow animate-pulse bg-slate-200 dark:bg-slate-400"></div>
    </div>

    <div v-else-if="catalog.error" class="p-4 bg-rose-50 border border-rose-200 rounded-xl">
      Ошибка: {{ catalog.error }}
    </div>

    <div v-else>
      <div v-if="!catalog.items.length" class="p-4 bg-white rounded-xl shadow">Ничего не найдено</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProductCard v-for="p in catalog.items" :key="p.id" :product="p" />
      </div>
      <Pagination class="mt-4" :page="catalog.page" :limit="catalog.limit" :total="catalog.total" @update:page="q.page = $event" />
    </div>
  </div>
</template>
