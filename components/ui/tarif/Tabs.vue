<script setup lang="ts">
import { useGetTarifDetailQuery } from '~/data/tariffs'
import { openState } from '~/stores/isOpen.store'

const { t } = useI18n()
const openComponent = openState()
const props = defineProps<{
  tarifId?: number | string,
  isAdmin?: boolean
}>()

const { data: tarifDetail, isLoading, error } = useGetTarifDetailQuery(String(props.tarifId || ''))

interface TariffType {
  id: number
  person_count: number
  price: number | string
}
interface Product {
  id: number
  name: string
  description: string
  image_url: string
  type: string
  category_id?: string | number
}
interface TariffDetail {
  name: string
  tariff_types: TariffType[]
  tariff_products: Product[]
}
interface Tab {
  label: string
  keys: readonly string[]
}
interface Section {
  label: string
  items: Product[]
}

const onClose = () => {
  openComponent.onClose();
}
// Tablar va bo'limlar
const tabs: readonly Tab[] = [
  { label: t('tariff.meals'), keys: ['meals'] },
  { label: t('tariff.salads'), keys: ['salads'] },
  { label: t('tariff.weddingTable'), keys: ['wedding_table'] },
  { label: t('tariff.bonuses'), keys: ['bonuses'] }
] as const

const activeTab: Ref<string> = ref(tabs[0].label)

// Ajratilgan bo'limlar uchun computed
const mealsSections: ComputedRef<Section[]> = computed(() => {
  const products: Product[] = (tarifDetail.value?.tariff_products || []).filter((p: Product) => p.type === 'meals')
  return [
    {
      label: t('tariff.firstMeal'),
      items: products.filter((p: Product) => String(p.category_id) === '1')
    },
    {
      label: t('tariff.secondMeal'),
      items: products.filter((p: Product) => String(p.category_id) === '2')
    }
  ]
})
const weddingSections: ComputedRef<Section[]> = computed(() => {
  const products: Product[] = (tarifDetail.value?.tariff_products || []).filter((p: Product) => p.type === 'wedding_table')
  return [
    {
      label: t('tariff.main'),
      items: products.filter((p: Product) => String(p.category_id) === '1')
    },
    {
      label: t('tariff.additionalDelicacies'),
      items: products.filter((p: Product) => String(p.category_id) === '2')
    }
  ]
})
const saladsSection: ComputedRef<Section[]> = computed(() => [
  {
    label: t('tariff.salads'),
    items: (tarifDetail.value?.tariff_products || []).filter((p: Product) => p.type === 'salads')
  }
])
const bonusesSection: ComputedRef<Section[]> = computed(() => [
  {
    label: t('tariff.bonuses'),
    items: (tarifDetail.value?.tariff_products || []).filter((p: Product) => p.type === 'bonuses')
  }
])

const tabSections: ComputedRef<Section[]> = computed(() => {
  if (activeTab.value === t('tariff.meals')) return mealsSections.value
  if (activeTab.value === t('tariff.weddingTable')) return weddingSections.value
  if (activeTab.value === t('tariff.salads')) return saladsSection.value
  if (activeTab.value === t('tariff.bonuses')) return bonusesSection.value
  return []
})

// Tabni avtomatik birinchi mavjud bo'limga o'zgartirish (ma'lumot kelganda)
watch(
  () => tarifDetail.value?.tariff_products,
  (products: Product[]) => {
    if (products?.length) {
      const firstType = tabs.find((tab: Tab) => products.some((p: Product) => tab.keys.includes(p.type)))
      if (firstType) activeTab.value = firstType.label
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <div v-if="isLoading">{{ t('common.loading') }}...</div>
    <div v-else-if="error">{{ t('error.title') }} {{ error.message }}</div>
    <div v-else class="flex flex-col gap-2 pb-20">
      <!-- EditBtn faqat admin sahifalarida ko'rinadi -->
      <div
        class="container mx-auto absolute bottom-0 left-0 right-0 flex items-center justify-center bg-white w-full min-h-16 border-t border-gray-300 px-5 py-3 z-30">
        <UButton v-if="tarifDetail && props.isAdmin" class="w-full flex items-center justify-center" color="secondary"
          size="xl" :label="t('admin.editButton')" @click="openComponent.onOpen('editTarif')" />
      </div>
      <div v-if="tarifDetail && tarifDetail.tariff_types && tarifDetail.tariff_types.length">
        <div class="p-2 bg-white rounded-lg flex flex-col gap-2">
          <h1 class="font-bold text-xl">{{ tarifDetail.name }}</h1>
          <div v-for="type in tarifDetail.tariff_types" :key="type.id" class="flex justify-between items-center">
            <span class="text-gray-500 text-xs md:text-sm">{{ type.person_count }} {{ t('weddingHall.peopleCount')
            }}</span>
            <span class="font-bold text-sm">{{ Number(type.price).toLocaleString('ru-RU') }} so'm</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-3 lg:gap-2 overflow-auto whitespace-nowrap mb-2 lg:hide-scrollbar min-h-[44px]">
        <button v-for="tab in tabs" :key="tab.label"
          class="px-3 md:px-2 py-2 md:py-1 rounded-xl font-medium whitespace-nowrap transition"
          :class="activeTab === tab.label ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'" style="flex-shrink: 0;"
          @click="activeTab = tab.label">
          {{ tab.label }}
        </button>
      </div>

      <!-- Bo'limlar va mahsulotlar -->
      <div v-if="tabSections.length">
        <div v-for="section in tabSections" :key="section.label">
          <h3 class="font-bold text-base my-2">{{ section.label }}</h3>
          <div v-if="section.items.length" class="grid grid-cols-2 gap-3">
            <div v-for="prod in section.items" :key="prod.id" class="rounded-xl bg-white p-2">
              <NuxtImg :src="prod.image_url" :alt="prod.name"
                class="rounded-lg w-full aspect-square object-cover mb-2" />
              <div class="font-medium text-base">{{ prod.name }}</div>
              <div class="text-muted text-sm">{{ prod.description }}</div>
            </div>
          </div>
          <div v-else class="text-gray-400 text-sm">{{ t('tariff.noProducts') }}</div>
        </div>

      </div>

      <div v-else>
        <p>{{ t('tariff.noCategoriesOrProducts') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>