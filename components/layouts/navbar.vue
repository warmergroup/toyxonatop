<script setup>
import { openState } from '~/stores/isOpen.store';

const { t } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const openComponent = openState();

const showSearchInput = computed(() => {
  const mainPath = localePath('/');
  const toyxonalarPath = localePath('/toyxonalar');
  return route.path === mainPath || route.path.startsWith(toyxonalarPath);
});

</script>

<template>
  <ClientOnly>
    <nav
      class="xl:container mx-auto lg:mx-auto fixed top-0 left-0 right-0 flex justify-between items-center bg-white z-50 w-full h-16 border-b border-gray-300 px-5 py-5">
      <NuxtLink :to="localePath('/')" class="flex items-center justify-center">
        <div class="h-16 w-16">
          <NuxtImg class="h-full w-full" src="/TOYXONACHI-02 png (oq).png" />
        </div>
        <h1 class="text-2xl font-bold">To'yxonachi</h1>
      </NuxtLink>

      <div class="flex w-full md:w-3/5 lg:w-fit justify-between items-center gap-5">
        <NuxtLink :to="localePath('/')" class="hidden lg:flex justify-between items-center gap-1"
          :class="{ 'text-[var(--primary-color)]': route.path === localePath('/') }">
          <UIcon name="custom:home" />
          <span>{{ t('common.main') }}</span>
        </NuxtLink>
        <NuxtLink :to="localePath('/toyxonalar')"
          class="hidden lg:flex justify-between items-center gap-1 whitespace-nowrap"
          :class="{ 'text-[var(--primary-color)]': route.path.startsWith(localePath('/toyxonalar')) }">
          <UIcon name="custom:navbar-search" />
          <span class="whitespace-nowrap">{{ t('common.weddingHalls') }}</span>
        </NuxtLink>
        <UiSearchPanel v-if="showSearchInput" />
      </div>

      <div class="flex justify-between items-center gap-3">
        <UiLangSwitcher class="hidden lg:block" />
        <Icon name="custom:bell" @click="openComponent.onOpen('notification')" />
        <NuxtLink :to="localePath('/profile')" class="hidden lg:block"
          :class="{ 'text-[var(--primary-color)]': route.path.startsWith(localePath('/profile')) }">
          <UIcon size="1.3rem" name="custom:person" />
        </NuxtLink>
      </div>

      <UiSlideOver :is-open="openComponent.isOpen && openComponent.componentType === 'notification'"
        :title="t('common.notifications')" @close="openComponent.onClose()">
        <UiNotification />
      </UiSlideOver>
    </nav>
  </ClientOnly>
</template>
