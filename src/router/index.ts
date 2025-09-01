import { createRouter, createWebHashHistory  } from 'vue-router'
import { useAuth } from '@/stores/auth'

import LoginPage from '@/pages/LoginPage.vue'
import CatalogPage from '@/pages/CatalogPage.vue'
import ProductPage from '@/pages/ProductPage.vue'
import CartPage from '@/pages/CartPage.vue'
import CheckoutPage from '@/pages/CheckoutPage.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/catalog' },
    { path: '/login', component: LoginPage },
    { path: '/catalog', component: CatalogPage },
    { path: '/product/:id', component: ProductPage },
    { path: '/cart', component: CartPage },
    { path: '/checkout', component: CheckoutPage },
    { path: '/:pathMatch(.*)*', redirect: '/catalog' },
  ]
})

router.beforeEach((to) => {
  const auth = useAuth()
  const isLogin = to.path === '/login'
  if (!auth.isAuthed && !isLogin) return '/login'
  if (auth.isAuthed && isLogin) return '/catalog'
})
