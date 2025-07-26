<script setup lang="ts">
import { openState } from "~/stores/isOpen.store"
import type { Section, Product } from "~/interfaces";

const openComponent = openState()
const router = useRouter()
const { t } = useI18n();
const localePath = useLocalePath();

interface ProductsRefExpose {
    sections: Section[]
    reset: () => void
}

const props = defineProps<{
    toyxonaId: number | null;
    tariffs: { id: number, name: string }[];
}>();
// Hozirgi tarif indexi
const currentTariffIndex = ref(0)
// Modal flag
const showModal = ref(false)
// Child komponentlarga ref
const nameFormRef = ref()
const pricesRef = ref()
const productsRef = ref<ProductsRefExpose | null>(null)

// Hozirgi tarif obyektini olish
const currentTariff = computed(() => props.tariffs?.[currentTariffIndex.value] || null)

// Saqlash tugmasi faolligi
const isSaveEnabled = computed(() => {
    const nameValid = nameFormRef.value?.tariffName?.name?.length > 0
    const pricesValid = pricesRef.value?.prices?.length > 0
    const productsValid = productsRef.value?.sections?.some((s: Section) => s.items.length > 0)
    return nameValid && pricesValid && productsValid
})

function resetForms() {
    nameFormRef.value?.reset?.()
    pricesRef.value?.reset?.()
    productsRef.value?.reset?.()
}

async function handleSave() {
    // Faqat keyingi tarifga o‘tamiz yoki modal ochamiz
    if (currentTariffIndex.value < props.tariffs.length - 1) {
        currentTariffIndex.value += 1
        nextTick(() => {
            resetForms()
        })
    } else {
        showModal.value = true
    }
}

const emit = defineEmits<{ (e: 'completed'): void }>()

function handleGoProfile() {
    openComponent.onClose()
    emit('completed')
    const path = localePath('/profile');
    router.push(path);
}
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-col items-center justify-between bg-white p-4 rounded-lg">
            <AdminTarifNameForm ref="nameFormRef" :key="currentTariff?.id" :toyxonaId="props.toyxonaId ?? null"
                :tariffId="currentTariff?.id ?? null" :defaultName="currentTariff?.name ?? ''" />
            <AdminTarifPrices ref="pricesRef" :tariffId="currentTariff?.id ?? null"
                :toyxonaId="props.toyxonaId ?? null" />
        </div>
        <AdminTarifProducts ref="productsRef" :key="currentTariff?.id" :tariffId="currentTariff?.id ?? null"
            :toyxonaId="props.toyxonaId ?? null" />

        <UButton class="w-full flex items-center justify-center" color="secondary" label="Saqlash"
            :disabled="!isSaveEnabled" @click="handleSave" />

        <!-- Modal oynasi -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div class="bg-white rounded-2xl p-6 flex flex-col items-center w-[320px]">
                <div class="bg-green-100 rounded-full p-4 mb-4">
                    <Icon name="i-heroicons-check-circle" class="text-green-500" size="48" />
                </div>
                <div class="font-bold text-lg mb-1 text-center">To‘yxona yaratildi</div>
                <div class="text-gray-500 text-center mb-4">Moderatsiya javobini kuting</div>
                <UButton class="w-full" color="primary" label="Asosiy sahifaga qaytish" @click="handleGoProfile" />
            </div>
        </div>
    </div>
</template>
