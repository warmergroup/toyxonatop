<script setup lang="ts">

const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <nav
    class="container mx-auto fixed bottom-0 flex justify-between items-center bg-white w-full h-16 border-t border-gray-300 px-5 py-3 z-40">
    <div class="container mx-auto px-5 w-full md:w-3/5 lg:w-fit flex gap-5 justify-between items-center ">
      <NuxtLink :to="localePath('/')" :class="{ 'text-[var(--primary-color)]': route.path === localePath('/') }"
        class="flex flex-col items-center justify-center">
        <UIcon name="custom:home" />
        <span>{{ t('common.main') }}</span>
      </NuxtLink>
      <NuxtLink :to="localePath('/toyxonalar')"
        :class="{ 'text-[var(--primary-color)]': route.path === localePath('/toyxonalar') }"
        class="flex flex-col items-center justify-center whitespace-nowrap">
        <UIcon name="custom:navbar-search" />
        <span class="whitespace-nowrap">{{ t('common.weddingHalls') }}</span>
      </NuxtLink>

      <NuxtLink :to="localePath('/profile')"
        :class="{ 'text-[var(--primary-color)]': route.path === localePath('/profile') }"
        class="flex flex-col items-center justify-center">
        <UIcon size="1.3rem" name="custom:person" />
        <span>{{ t('common.profile') }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
