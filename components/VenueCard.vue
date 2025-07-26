<script setup lang="ts">
import type { IToyxonalar } from "~/interfaces";
import { useLocationStore } from '~/stores/location.store'
import { getDistanceFromLatLonInKm } from '~/utils/distance'

const props = defineProps<{ toyxona: IToyxonalar }>();
const { t } = useI18n();
const localePath = useLocalePath();
const locationStore = useLocationStore();
const router = useRouter();

const isImageLoading = ref(true);
const isImageError = ref(false);

const navigateToVenue = () => {
  const path = localePath(`/toyxona/${props.toyxona.id}`);
  router.push(path);
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    navigateToVenue();
  }
};

const distance = computed(() => {
  if (
    locationStore.coords &&
    props.toyxona.latitude &&
    props.toyxona.longitude
  ) {
    const venueLat = parseFloat(props.toyxona.latitude)
    const venueLon = parseFloat(props.toyxona.longitude)

    return getDistanceFromLatLonInKm(
      locationStore.coords.latitude,
      locationStore.coords.longitude,
      venueLat,
      venueLon
    )
  }
  return null
})
</script>

<template>
  <div class="card overflow-hidden group cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
    @click="navigateToVenue" @keydown="onKeyDown" tabindex="0" role="button"
    :aria-label="`${toyxona.name} - ${toyxona.address || t('venue.noAddress')}`">
    <div class="relative overflow-hidden aspect-video">
      <template v-if="toyxona.wedding_hall_pictures?.length && !isImageError">
        <NuxtImg class="w-full h-full aspect-video object-cover rounded-b-xl transition-transform duration-300"
          loading="lazy" :src="toyxona.wedding_hall_pictures[0].image_url" :alt="toyxona.name"
          @load="isImageLoading = false" @error="isImageError = true" />
        <USkeleton v-if="isImageLoading" class="w-full h-full aspect-video rounded-b-xl absolute top-0 left-0" />
      </template>
      <template v-else>
        <UiNoImage />
      </template>
    </div>
    <div class="p-4">
      <h2 class="text-base font-bold">{{ toyxona.name }}</h2>
      <div class="flex gap-2 items-center text-[var(--text-secondary)]">
        <UIcon class="size-5" name="custom:location" aria-hidden="true" />
        <span class="text-sm">{{ toyxona.address || t('venue.noAddress') }}</span>
      </div>
      <div class="flex gap-2 items-center text-[var(--text-secondary)]">
        <UIcon class="w-[14px] h-[14px]" name="custom:cursor" aria-hidden="true" />
        <span v-if="distance !== null" class="text-sm">{{ distance.toFixed(1) }} km {{ t('common.fromYou') }}</span>
      </div>
    </div>
  </div>
</template>