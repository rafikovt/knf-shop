<script setup lang="ts">
const props = defineProps<{
  q: string
  min?: string | number
  max?: string | number
  inStock?: string | boolean
  rarity?: string
  sort?: string
}>()
const emit = defineEmits(['update:q','update:min','update:max','update:inStock','update:rarity','update:sort'])
</script>

<template>
  <div class="bg-white p-3 rounded-xl shadow mb-3 grid grid-cols-2 md:grid-cols-6 gap-2">
    <input class="border rounded px-2 py-1" placeholder="Поиск" :value="props.q" @input="emit('update:q', ($event.target as HTMLInputElement).value)" />
    <input class="border rounded px-2 py-1" placeholder="Мин $" :value="props.min" @input="emit('update:min', ($event.target as HTMLInputElement).value)" />
    <input class="border rounded px-2 py-1" placeholder="Макс $" :value="props.max" @input="emit('update:max', ($event.target as HTMLInputElement).value)" />
    <select class="border rounded px-2 py-1" :value="props.inStock" @change="emit('update:inStock', ($event.target as HTMLSelectElement).value)">
      <option value="">Все</option>
      <option value="true">В наличии</option>
      <option value="false">Нет</option>
    </select>
    <select class="border rounded px-2 py-1" :value="props.rarity" @change="emit('update:rarity', ($event.target as HTMLSelectElement).value)">
      <option value="">Редкость</option>
      <option value="consumer">consumer</option>
      <option value="industrial">industrial</option>
      <option value="mil-spec">mil-spec</option>
      <option value="restricted">restricted</option>
      <option value="classified">classified</option>
      <option value="covert">covert</option>
    </select>
    <select class="border rounded px-2 py-1" :value="props.sort" @change="emit('update:sort', ($event.target as HTMLSelectElement).value)">
      <option value="">Сортировка</option>
      <option value="price_asc">Цена ↑</option>
      <option value="price_desc">Цена ↓</option>
    </select>
  </div>
</template>
