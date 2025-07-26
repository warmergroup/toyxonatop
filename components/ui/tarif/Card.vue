<script setup lang="ts">

const { t } = useI18n();

defineProps<{
  tarif: {
    name: string
    tariff_types: {
      id: number | string
      person_count: string
      price: string
    }[]
  }
}>()

</script>

<template>
  <div class="flex justify-between items-center p-3 rounded-lg bg-[var(--secondary-background-color)] cursor-pointer">
    <div>
      <div class="font-semibold">{{ tarif.name }}</div>
      <div class="text-sm text-gray-500">
        <div v-for="type in tarif.tariff_types" :key="type.id">
          {{ type.person_count }} {{ t('weddingHall.peopleCount') }} {{ type.price }} so'm
        </div>
      </div>
    </div>
    <UIcon name="custom:chevron-right" />
  </div>
</template>
