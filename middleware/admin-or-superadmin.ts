import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  const localePath = useLocalePath() // Nuxt i18n composable

  if (!auth.isAuth || !(auth.isAdmin || auth.isSuperAdmin)) {
    return navigateTo(localePath('/profile'))
  }
})