<script setup lang="ts">
import { useGetToyxonalarQuery } from "~/data";
import type { IToyxonalar } from "~/interfaces";
import { useSearchStore } from '~/stores/search.store'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl
const searchStore = useSearchStore()
const price = ref(true)
const { isLargeScreen } = useScreenSize()
const { isLoading, error, data: toyxonalarData } = useGetToyxonalarQuery(0, 10, price.value);
const toyxonalar = computed<IToyxonalar[]>(() => toyxonalarData.value);
const { t } = useI18n()

useHead({
  title: t('seo.mostExpensive'),
  meta: [
    { name: 'description', content: t('seo.listDescription') },
    { property: 'og:title', content: t('seo.listTitle') },
    { property: 'og:description', content: t('seo.listDescription') },
    {
      property: 'og:image', content: `${siteUrl}/preview-logo.png`
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${siteUrl}/toyxonalar` },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [
    { rel: 'canonical', href: `${siteUrl}/toyxonalar` },
    { rel: 'alternate', hreflang: 'uz', href: `${siteUrl}/uz/toyxonalar` },
    { rel: 'alternate', hreflang: 'ru', href: `${siteUrl}/ru/toyxonalar` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en/toyxonalar` },

  ]
})

const filteredToyxonalar = computed(() => {
  if (!searchStore.query) return toyxonalar.value
  return toyxonalar.value.filter((t: IToyxonalar) =>
    t.name?.toLowerCase().includes(searchStore.query.toLowerCase())
  )
})

</script>


<template>
  <div>
    <LayoutsMobileTopbar v-if="!isLargeScreen" />
    <section class="space-y-3 bg-[var(--background-color)] px-5 pt-20">
      <h2 class="text-lg md:text-xl font-bold text-text-primary py-2">{{ t('common.mostExpensive') }}</h2>
      <div v-if="isLoading" class="fixed w-full h-full flex flex-col items-center justify-center ">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary" />
        <p class="mt-4 text-lg text-gray-600">{{ t('common.loading') }}</p>
      </div>
      <!--    <div v-else-if="error" class="text-center text-red-500">{{ error.message }}</div>-->
      <div v-else-if="!toyxonalar" class="text-center text-gray-500">
        {{ t('weddingHall.notFound') }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <VenueCard v-for="toyxona in filteredToyxonalar" :key="`wedding-${toyxona.id}`" :toyxona="toyxona" />
      </div>
    </section>
  </div>
</template>
