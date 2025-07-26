<script setup lang="ts">
const isAppLoading = ref(true)
const { isLargeScreen } = useScreenSize();

onMounted(() => {
  isAppLoading.value = false
})

</script>

<template>
  <div v-show="isAppLoading"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500"
    :class="{ 'opacity-0 pointer-events-none': !isAppLoading }">
    <NuxtImg src="/logo-splash.svg" alt="Splash" class="w-64 h-64 lg:w-72 lg:h-72 animate-pulse" />
  </div>
  <LayoutsNavbar v-if="isLargeScreen" />
  <section>
    <slot />
  </section>
  <LayoutsMobileNavbar v-if="!isLargeScreen" class="lg:hidden" />
</template>
