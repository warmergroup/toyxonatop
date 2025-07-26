<script setup lang="ts">
const props = defineProps<{
  items: { src: string, id?: number, wedding_hall_id?: number | string }[],
  rounded?: boolean,
  arrows?: boolean,
  isLoading?: boolean,
  onItemClick?: (item: any) => void
}>()
</script>

<template>
  <div :class="['relative w-full max-w-screen-xl mx-auto', props.rounded ? 'rounded-xl' : '']">
    <UCarousel v-slot="{ item }" :items="props.items" loop :arrows="props.arrows && props.items.length > 1"
      :dots="props.items.length > 1" :autoplay="props.items.length > 1 ? { delay: 4000 } : false" :ui="{
        arrows: 'absolute inset-0 flex items-center justify-between z-10',
        prev: 'bg-white/50 hover:bg-white text-black rounded-full p-1 md:p-2 md:ml-20',
        next: 'bg-white/50 hover:bg-white text-black rounded-full p-1 md:p-2 md:mr-20',
        dots: 'mb-8  md:mb-10'
      }">
      <NuxtImg v-if="item.src" :src="item.src"
        :class="['w-full aspect-video lg:h-80 object-cover cursor-pointer', props.rounded ? 'rounded-xl' : '']"
        style="cursor: pointer" @click="props.onItemClick && props.onItemClick(item)" />
      <USkeleton v-if="props.isLoading" class="w-full h-full aspect-video" />
    </UCarousel>
  </div>
</template>
