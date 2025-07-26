<script lang="ts" setup>
import * as locales from '@nuxt/ui/locale'
import { useGetMeQuery } from '~/data';
import { setupForegroundListener, getFCMToken } from '~/utils/firebase'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl
const vapidKey = config.public.vapidKey
const { locale } = useI18n()
const { changeLanguage } = useLanguage()
const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

onMounted(async () => {
  // Faqat client-side'da ishlaydi
  if (process.client) {
    const savedLang = localStorage.getItem('selectedLang')

    if (savedLang && savedLang !== locale.value) {
      changeLanguage(savedLang as 'uz' | 'ru' | 'en')
    }

    const token = localStorage.getItem('token')
    if (token) {
      const { refetch } = useGetMeQuery()
      refetch()
    }

    // Firebase messaging'ni login oldin ham ishga tushirish
    if (vapidKey) {
      await getFCMToken(vapidKey)
    }

    // FCM foreground listener'ni ishga tushirish
    await setupForegroundListener()
  }
})

useHead({
  htmlAttrs: {
    lang,
    dir
  },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "To'yxonachi",
        "url": siteUrl
      })
    }
  ]
})
</script>

<template>
  <div class="h-full w-full bg-[var(--background-color)]">
    <UApp :locale="locales[locale]">
      <div class="container mx-auto w-full min-h-[100vh]" data-vaul-drawer-wrapper>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>
    </UApp>
  </div>
</template>
