<script lang="ts" setup>
import { openState } from '~/stores/isOpen.store';

const openComponent = openState();
const { t } = useI18n();
</script>

<template>
  <div
    class="bg-white mx-auto lg:mx-0 w-full flex flex-col justify-center items-center gap-2 px-1 py-2 md:p-4 rounded-md">
    <h2 class="font-semibold text-lg text-center">{{ t('profile.registerPrompt') }}</h2>
    <UiMainButton :label="t('profile.register')" @click="openComponent.onOpen('auth')" />
  </div>
</template>