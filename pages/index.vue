<script setup lang="ts">
import { useInfiniteToyxonalarQuery } from '~/data'
import { getDiscounts } from "~/data"
import { useSearchStore } from '~/stores/search.store'

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl
const searchStore = useSearchStore()
const { isLargeScreen } = useScreenSize();
const { t } = useI18n()
const localePath = useLocalePath();
const router = useRouter()
const { data: toyxonalarData, isLoading: toyxonaLoading, fetchNextPage, isFetchingNextPage, error } = useInfiniteToyxonalarQuery()
const { data: banners, isLoading: isBannersLoading } = getDiscounts()
const infiniteScrollTrigger = ref<null | HTMLElement>(null)
const toyxonalar = computed(() => (toyxonalarData.value?.pages || []).flat())

useHead({
  title: t('seo.homeTitle'),
  meta: [
    { name: 'description', content: t('seo.homeDescription') },
    { property: 'og:title', content: t('seo.homeTitle') },
    { property: 'og:description', content: t('seo.homeDescription') },
    { property: 'og:image', content: `${siteUrl}/preview-logo.png` },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${siteUrl}` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t('seo.homeTitle') },
    { name: 'twitter:description', content: t('seo.homeDescription') },
    {
      name: 'twitter:image', content: `${siteUrl}/preview-logo.png`
    }
  ],
  link: [
    { rel: 'canonical', href: `${siteUrl}` },
    { rel: 'alternate', hreflang: 'uz', href: `${siteUrl}/uz` },
    { rel: 'alternate', hreflang: 'ru', href: `${siteUrl}/ru` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en` }
  ]
})

const filteredToyxonalar = computed(() => {
  if (!searchStore.query) return toyxonalar.value
  return toyxonalar.value.filter(t =>
    t.name?.toLowerCase().includes(searchStore.query.toLowerCase())
  )
})

const carouselItems = computed(() =>
  (banners.value as any[] || []).map(b => ({
    src: b.image_url,
    id: b.id,
    wedding_hall_id: b.wedding_hall_id
  }))
)

const handleBannerClick = (item: { wedding_hall_id?: string | number }) => {
  if (item.wedding_hall_id) {
    const path = localePath(`/toyxona/${item.wedding_hall_id}`);
    router.push(path);
  }
};

onMounted(() => {
  const { getCurrentPosition } = useCurrentPosition()
  getCurrentPosition()

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isFetchingNextPage.value) {
      fetchNextPage()
    }
  })

  if (infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value)
  }

  onUnmounted(() => {
    if (infiniteScrollTrigger.value) observer.unobserve(infiniteScrollTrigger.value)
  })
})
</script>

<template>
  <div class="pb-20">
    <LayoutsMobileTopbar v-if="!isLargeScreen" />
    <section class="space-y-3 bg-[var(--background-color)] px-5 pt-20">
      <USkeleton v-if="isBannersLoading" class="w-full aspect-video lg:h-80 my-4 bg-gray-500" />
      <div v-if="carouselItems.length" class="container mx-auto lg:px-10">
        <UiCarousel :items="carouselItems" :rounded="true" :arrows="true" :is-loading="isBannersLoading"
          :on-item-click="handleBannerClick" />
      </div>

      <h2 v-if="!toyxonaLoading && toyxonalar && toyxonalar.length > 0"
        class="text-xl font-bold text-text-primary py-2">{{ t('common.weddingHalls') }}</h2>

      <div v-if="error" class="text-center text-red-500">
        {{ error?.message || t('common.error') }}
      </div>

      <div v-if="toyxonaLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <UiCardPlaceholder v-for="n in 8" :key="`placeholder-${n}`" />
      </div>

      <div v-if="toyxonalar && toyxonalar.length > 0 && !toyxonaLoading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <VenueCard v-for="toyxona in filteredToyxonalar" :key="`wedding-${toyxona.id}`" :toyxona="toyxona" />
      </div>

      <div v-else-if="!toyxonaLoading && (!toyxonalar || toyxonalar.length === 0)"
        class="text-center text-gray-500 py-10">
        {{ t('weddingHall.notFound') }}
      </div>

      <div ref="infiniteScrollTrigger">
        <USkeleton v-if="isFetchingNextPage" class="w-full h-20 my-4" />
      </div>
    </section>
  </div>
</template>
