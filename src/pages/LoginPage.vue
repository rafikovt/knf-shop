<script setup lang="ts">
import { useAuth } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'

type Form = { nickname: string; pass: string }
type Errors = Partial<Record<keyof Form, string>>

const auth = useAuth()
const router = useRouter()

const loading = ref(false)
const errors = reactive<Errors>({})
const form = reactive<Form>({
  nickname: '',
  pass: '',
})
const touched = reactive<Record<keyof Form, boolean>>({
  nickname: false,
  pass: false,
})

const validate = (): boolean => {
  errors.nickname = form.nickname.trim() ? '' : 'Введите логин'
  errors.pass = form.pass.trim() ? '' : 'Введите пароль'
  return !errors.nickname && !errors.pass
}
const onBlur = (field: keyof Form) => {
  touched[field] = true
  validate()
}


const submit = async () => {
  if (!validate()) {
    touched.nickname = true
    touched.pass = true
    return
  }
  loading.value = true
  try {
    await auth.login(form.nickname.trim(), form.pass.trim())
    router.push('/catalog')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login max-w-md mx-auto mt-20 bg-white rounded-2xl shadow p-6">
    <h1 class="text-xl font-bold mb-4">Вход</h1>

    <div class="space-y-4">
      <div>
        <label class="block mb-1 text-sm font-medium" for="nickname">Логин</label>
        <input
            id="nickname"
            v-model="form.nickname"
            :aria-invalid="!!errors.nickname && touched.nickname"
            :class="['w-full border rounded px-3 py-2 outline-none', (errors.nickname && touched.nickname) ? 'border-rose-400' : 'border-slate-300']"
            type="text"
            placeholder="Например, Alex"
            @blur="onBlur('nickname')"
        />
        <p v-if="errors.nickname && touched.nickname" class="mt-1 text-xs text-rose-600">
          {{ errors.nickname }}
        </p>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium" for="password">Пароль</label>
        <input
            id="password"
            v-model="form.pass"
            :aria-invalid="!!errors.pass && touched.pass"
            :class="['w-full border rounded px-3 py-2 outline-none', (errors.pass && touched.pass) ? 'border-rose-400' : 'border-slate-300']"
            type="password"
            @blur="onBlur('pass')"
        />
        <p v-if="errors.pass && touched.pass" class="mt-1 text-xs text-rose-600">
          {{ errors.pass }}
        </p>
      </div>

      <button
          class="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white rounded px-3 py-2 disabled:opacity-60"
          :disabled="loading"
          aria-label="Войти"
          @click="submit"
      >
        <span v-if="loading" class="loader h-4 w-4"></span>
        <span>{{ loading ? 'Входим…' : 'Войти' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.loader {
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
