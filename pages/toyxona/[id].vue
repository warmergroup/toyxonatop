<script setup lang="ts">
import type { IToyxonalar } from '~/interfaces';
import { useLocationStore } from '~/stores/location.store';
import { getDistanceFromLatLonInKm } from '~/utils/distance'
import { openState } from '~/stores/isOpen.store';

const config = useRuntimeConfig()
const imageUrl = config.public.imageUrl
const apiUrl = config.public.apiUrl
const siteUrl = config.public.siteUrl
const openComponent = openState();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { isLargeScreen } = useScreenSize();
const locationStore = useLocationStore()
const { data: toyxona, error: toyxonaError, pending } = await useAsyncData<IToyxonalar>('toyxona', () =>
  $fetch(`/api/wedding-halls/show/${route.params.id}`, {
    baseURL: apiUrl
  })
)

const error = computed(() => {
  if (toyxonaError.value) {
    return toyxonaError.value?.message || 'Toyxona ma\'lumotlari yuklanmadi';
  }
  return null;
});
const selectedTarif = ref<any | null>(null);

const goback = () => {
  router.go(-1);
};
const onClose = () => {
  openComponent.onClose();

  // Return focus to the trigger element
  nextTick(() => {
    const triggerElement = document.querySelector('[data-tarif-trigger]');
    if (triggerElement) {
      (triggerElement as HTMLElement).focus();
    }
  });
}

function getFullImageUrl(imageName?: string) {
  if (!imageName) return ''
  if (imageName.startsWith('http')) return imageName
  return imageUrl + (imageName.startsWith('/') ? '' : '/') + imageName
}

const userDistance = computed(() => {
  if (
    locationStore.coords &&
    toyxona.value &&
    toyxona.value.latitude &&
    toyxona.value.longitude
  ) {
    return getDistanceFromLatLonInKm(
      locationStore.coords.latitude,
      locationStore.coords.longitude,
      Number(toyxona.value.latitude),
      Number(toyxona.value.longitude)
    )
  }
  return null
})

const imagelItems = computed(() =>
  (toyxona?.value?.wedding_hall_pictures as any[] || []).map(b => ({
    src: b.image_url,
    id: b.id,
    wedding_hall_id: b.wedding_hall_id
  }))
)

const shareLink = () => {
  if (navigator.share) {
    navigator.share({
      title: "Chekout this weddingHall",
      text: "toyxonachi.uz",
      url: window.location.href,
    })
      .then(() => console.log('Shared successfully'))
      .catch((error: any) => console.error('Error sharing:', error));
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Link copied to clipboard!'))
      .catch((error) => console.error('Error copying link:', error));
  } else {
    alert('Sharing is not supported on this device. Please copy the link manually: ' + window.location.href);
  }
};

const tariflarForCard = computed(() =>
  Array.isArray(toyxona.value?.tariffs)
    ? toyxona.value.tariffs.map((tarif: any) => ({
      ...tarif,
      tariff_types: tarif.tariff_types || []
    }))
    : []
);

const openTarifSlide = (tarif: any, event?: KeyboardEvent) => {
  // Prevent default for keyboard events
  if (event) {
    event.preventDefault();
  }

  selectedTarif.value = tarif;
  openComponent.onOpen('showTariff');

  // Focus management for accessibility
  nextTick(() => {
    const slideOver = document.querySelector('[role="dialog"]');
    if (slideOver) {
      const focusableElements = slideOver.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  });
};
const openMap = () => {
  if (!toyxona.value) return;
  const lat = toyxona.value.latitude;
  const lon = toyxona.value.longitude;
  // Google Maps universal link
  const url = `https://maps.google.com/?q=${lat},${lon}`;
  window.open(url, '_blank');
};

const showFullDescription = ref(false);
const DESCRIPTION_LIMIT = 180;
const shortDescription = computed(() => {
  if (!toyxona.value?.description) return '';
  return toyxona.value.description.length > DESCRIPTION_LIMIT
    ? toyxona.value.description.slice(0, DESCRIPTION_LIMIT)
    : toyxona.value.description;
});
const isTruncated = computed(() => {
  return toyxona.value?.description && toyxona.value.description.length > DESCRIPTION_LIMIT;
});
function toggleDescription() {
  showFullDescription.value = !showFullDescription.value;
}

const defaultImg = '/logo-splash.svg'
const img = getFullImageUrl(toyxona.value?.wedding_hall_pictures?.[0]?.image_url) || defaultImg

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'EventVenue',
  name: toyxona.value?.name,
  description: toyxona.value?.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: toyxona.value?.address
  },
  telephone: toyxona.value?.phone1,
  image: toyxona.value?.wedding_hall_pictures?.[0]?.image_url
}))

useHead({
  title: toyxona.value ? `${toyxona.value.name} — Toyxonachi` : 'toyxonachi.uz',
  meta: [
    { name: 'description', content: toyxona.value?.description?.slice(0, 160) || t('seo.listDescription') },
    { property: 'og:title', content: toyxona.value?.name || 'toyxonachi.uz' },
    { property: 'og:description', content: toyxona.value?.description?.slice(0, 160) || t('seo.listDescription') },
    { property: 'og:image', content: img },
    { property: 'og:image:width', content: '1920' },
    { property: 'og:image:height', content: '1080' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${siteUrl}/uz/toyxona/${toyxona.value?.id}` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: toyxona.value?.name || 'toyxonachi.uz' },
    { name: 'twitter:description', content: toyxona.value?.description?.slice(0, 350) || t('seo.listDescription') },
    { name: 'twitter:image', content: img }
  ],
  link: [
    { rel: 'alternate', hreflang: 'uz', href: `${siteUrl}/uz` },
    { rel: 'alternate', hreflang: 'ru', href: `${siteUrl}/ru` },
    { rel: 'alternate', hreflang: 'en', href: `${siteUrl}/en` }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData.value)
    }
  ]
})

</script>

<template>
  <!-- Skip to main content link for accessibility -->
  <a href="#main-content"
    class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50">
    Asosiy kontentga o'tish
  </a>

  <div v-if="error" class="flex items-center justify-center h-64" role="alert" aria-live="assertive">
    <div class="text-center">
      <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <p class="text-text-secondary mb-4">{{ error }}</p>
      <button @click="$router.go(0)"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label="Sahifani qayta yuklash">
        Sahifani qayta yuklash
      </button>
    </div>
  </div>
  <div v-else-if="toyxona" id="main-content" class="pb-30 lg:px-5 lg:py-20 w-full h-full">
    <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
      <!-- Chap ustun (2/3) -->
      <div class="flex flex-col lg:gap-4 lg:col-span-2 lg:rounded-lg w-full h-full bg-white">
        <template v-if="isLargeScreen">
          <UiThumbnailGallery class="px-3 pt-3" :toyxona="toyxona" />
        </template>
        <div v-if="!isLargeScreen" ref="imageRef" class="sticky top-0 w-full h-auto">
          <div class="relative">
            <UiCarousel
              v-if="toyxona && Array.isArray(toyxona.wedding_hall_pictures) && toyxona.wedding_hall_pictures.length > 1"
              :items="imagelItems" :rounded="false" :arrows="false" />
            <NuxtImg v-else-if="toyxona && toyxona.wedding_hall_pictures.length > 0"
              :src="toyxona.wedding_hall_pictures[0].image_url" :alt="toyxona.name"
              class="w-full aspect-video object-cover" />
            <UiNoImage v-else class="w-full aspect-video" />
            <div
              class="absolute w-full h-full top-0 left-0 p-3 inset-0 pointer-events-none bg-gradient-to-b from-black to-transparent opacity-30">
              <div class="flex items-center justify-between pointer-events-auto">
                <button
                  class="z-10 w-[36px] h-[36px] backdrop-blur-md bg-white/50 rounded-full p-2 cursor-pointer flex items-center justify-center border border-white hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  @click="goback()" aria-label="Orqaga qaytish">
                  <Icon class="text-white" name="custom:arrow-back" />
                </button>

                <button
                  class="z-10 w-[36px] h-[36px] backdrop-blur-md bg-white/50 rounded-full p-2 cursor-pointer flex items-center justify-center border border-white hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  @click="shareLink" aria-label="Ulashish">
                  <Icon name="custom:share-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 p-3 z-10 bg-white rounded-t-2xl">
          <div>
            <h1 class="font-bold text-xl" tabindex="0">{{ toyxona.name }}</h1>
            <p class="font-medium text-sm">{{ toyxona.address }}</p>
            <p v-if="userDistance" class="text-text-secondary">
              {{ userDistance.toFixed(1) }} km {{ t('common.fromYou') }}
            </p>
          </div>

          <!-- Tariffs -->
          <h2 class="font-medium text-lg text-text-primary">{{ t('weddingHall.tariffs') }}</h2>
          <UiTarifCard v-for="tarif in tariflarForCard" :key="tarif.id" :tarif="tarif" @click="openTarifSlide(tarif)"
            @keydown.enter="openTarifSlide(tarif)" @keydown.space="openTarifSlide(tarif)" :data-tarif-trigger="tarif.id"
            tabindex="0" role="button" :aria-label="`${tarif.name} tarifini ko'rish`" />


        </div>
      </div>
      <!-- O‘ng ustun (1/3) -->
      <div class="flex flex-col gap-4">
        <div class="relative bg-white p-4 rounded-b-lg lg:rounded-lg">
          <h2 class="text-xl font-medium text-text-primary mb-4 capitalize ">{{ t('weddingHall.description')
          }}
          </h2>
          <transition name="fade-expand">
            <span v-if="showFullDescription" key="full" :id="`description-${toyxona.id}`"
              class="text-gray-500 text-sm block whitespace-pre-line">
              {{ toyxona.description }}
            </span>
            <span v-else key="short" :id="`description-${toyxona.id}`"
              class="text-gray-500 text-sm block whitespace-pre-line">
              {{ shortDescription }}<span v-if="isTruncated">...</span>
            </span>
          </transition>
          <button v-if="isTruncated" @click="toggleDescription"
            class="text-green-500 font-medium mt-2 flex items-center gap-1 select-none hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
            :aria-expanded="showFullDescription" :aria-controls="`description-${toyxona.id}`">
            <span>{{ showFullDescription ? t('common.readLess') : t('common.readMore') }}</span>
            <svg :class="{ 'rotate-180': showFullDescription, 'transition-transform': true }" width="16" height="16"
              fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 6l4 4 4-4" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <!-- Map -->
        <div class="bg-white lg:rounded-lg shadow-sm p-4">
          <h2 class="text-xl font-medium text-text-primary mb-4 capitalize" id="location-heading">{{
            t('weddingHall.location')
          }}</h2>
          <div class="bg-gray-100 rounded-lg overflow-hidden mb-4" role="region" aria-labelledby="location-heading">
            <YandexMap :center="{ lat: Number(toyxona.latitude), lng: Number(toyxona.longitude) }" :title="toyxona.name"
              :zoom="16" height="h-48 md:h-64 lg:h-80" />
          </div>
          <div class="flex items-center text-text-secondary mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{{ toyxona.address }}</span>
          </div>
          <UButton variant="soft" color="neutral" class="w-full py-2 flex items-center justify-between" @click="openMap"
            :aria-label="`${t('weddingHall.goDirection')} - ${toyxona.address}`">
            <div></div>
            <span class="text-primary">{{ t('weddingHall.goDirection') }}</span>
            <Icon name="custom:chevron-right" aria-hidden="true" />
          </UButton>
        </div>
        <!-- Contact info -->
        <div class="bg-white lg:rounded-lg shadow-sm p-4 flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <NuxtLink
              class="w-10 h-10 flex items-center justify-center rounded-full border border-stone-100 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              :to="`https://www.instagram.com/${toyxona.instagram}`" target="_blank"
              :aria-label="`Instagram sahifasiga o'tish - ${toyxona.instagram}`">
              <Icon size="24px" class="w-10 h-10" name="custom:instagram" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink
              class="w-10 h-10 flex items-center justify-center rounded-full border border-stone-100 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              :to="`https://t.me/${toyxona.telegram}`" target="_blank"
              :aria-label="`Telegram kanaliga o'tish - ${toyxona.telegram}`">
              <Icon size="24px" class="w-full h-full" name="custom:logos-telegram" aria-hidden="true" />
            </NuxtLink>
          </div>
          <UiPhoneDropdown :phone1="toyxona.phone1" :phone2="toyxona.phone2" />
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="pending && !toyxona" class="mx-auto mt-50vh flex items-center justify-center h-64" role="status"
    aria-live="polite">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
      <p class="text-text-secondary">{{ t('common.loading') }}</p>
    </div>
  </div>
  <div v-else class="mx-auto mt-50vh flex items-center justify-center h-64" role="status" aria-live="polite">
    <div class="text-center">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
      </svg>
      <p class="text-text-secondary">Toyxona topilmadi</p>
    </div>
  </div>
  <UiSlideOver :isOpen="openComponent.isOpen && openComponent.componentType === 'showTariff'"
    :title="selectedTarif?.name || 'Tarif'" @close="onClose">
    <UiTarifTabs :tarif-id="selectedTarif?.id" />
  </UiSlideOver>
</template>
