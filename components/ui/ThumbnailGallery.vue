<script lang="ts" setup>
import type { IToyxonalar } from '~/interfaces'

const { t } = useI18n()
const props = defineProps<{
  toyxona: IToyxonalar;
}>()
const selectedImage = ref<string | null>(null);
const images = computed(() => props.toyxona.wedding_hall_pictures.map(i => i.image_url))
</script>

<template>
  <div class="flex gap-2">
    <!-- select image section -->
    <div v-if="images.length > 1" class="flex flex-col gap-2">
      <div v-for="(image, index) in images" :key="index"
        class="w-[80px] h-[80px] rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200"
        :class="selectedImage === image ? 'border-[var(--primary-color)]' : 'border-transparent'"
        @click="selectedImage = image">
        <NuxtImg :src="image" :alt="`image ${index + 1}`" loading="lazy" class="w-full h-full object-cover"
          placeholder />
      </div>
    </div>

    <!-- main image section -->
    <div class="relative w-full rounded-lg overflow-hidden min-h-[200px] flex items-center justify-center">
      <template v-if="images.length > 0">
        <NuxtImg :src="selectedImage || images[0]" :alt="props.toyxona.name" class="w-full aspect-video object-cover"
          loading="lazy" placeholder />
      </template>
      <template v-else>
        <UiNoImage />
      </template>
      <div v-if="images.length > 0"
        class="absolute flex flex-col bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent lg:p-6">
        <div class="flex gap-2 items-center">
          <h1 class="text-2xl font-bold text-white">{{ props.toyxona.name }}</h1>
        </div>
        <div class="flex items-center">
          <div class="text-white flex gap-5">
            <span>{{ props.toyxona.address || t('venue.noAddress') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>