<script setup lang="ts">
import { useSearchStore } from '~/stores/search.store'
const { t } = useI18n()
const searchStore = useSearchStore()
</script>
<template>
  <div class="relative w-full">
    <UInput icon="custom:search" size="xl" class="w-full rounded-lg border border-gray-300"
      :placeholder="t('common.search')" variant="soft" v-model="searchStore.query" />
  </div>
</template>