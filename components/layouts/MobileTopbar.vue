<script setup lang="ts">
import { openState } from '~/stores/isOpen.store';

const { t } = useI18n();
const openComponent = openState();

</script>
<template>
  <div
    class="fixed top-0 lg:hidden container mx-auto flex justify-between items-center gap-2 md:gap-4 bg-white z-50 w-full border-b rounded-b-2xl border-gray-300 px-5 py-5 transition-transform duration-300">
    <UiSearchPanel />
    <Icon name="custom:bell" @click="openComponent.onOpen('notification')" />
    <UiSlideOver :isOpen="openComponent.isOpen && openComponent.componentType === 'notification'"
      @close="openComponent.onClose()" :title="t('common.notifications')">
      <UiNotification />
    </UiSlideOver>
  </div>
</template>