<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useCreateTariffType, useDeleteTariffType, useChangeToyxonaStatus } from '~/data'
import { useQueryClient } from '@tanstack/vue-query'
import { vMaska } from 'maska/vue'

const { t } = useI18n()
const props = defineProps<{
    tariffId: number | null,
    toyxonaId?: number | null, // Yangi prop qo'shamiz
    initialPrices?: Array<{
        id: number
        tariff_id: string
        person_count: string
        price: string
        created_at: string
        updated_at: string
    }>
}>()

// Form state
const state = reactive({
    person_count: '',
    price: ''
})

// Tariflar ro'yxati
const prices = ref(props.initialPrices || [])

// Watch for changes in initialPrices
watch(
    () => props.initialPrices,
    (newPrices) => {
        if (newPrices) {
            prices.value = newPrices
        }
    },
    { immediate: true }
)

const { mutate: createTariffType, isPending: isCreating } = useCreateTariffType()
const changeStatus = useChangeToyxonaStatus()
const queryClient = useQueryClient()

function addPrice() {
    if (!state.person_count || !state.price || !props.tariffId) return;
    createTariffType({
        tariff_id: props.tariffId,
        person_count: Number(state.person_count),
        price: Number(state.price.replace(/\s/g, ''))
    }, {
        onSuccess(data) {
            prices.value = Array.isArray(data) ? data : [data, ...prices.value];
            state.person_count = '';
            state.price = '';
            // Narx o'zgartirilganda toyxona statusini review ga o'tkazish
            if (props.toyxonaId) {
                changeStatus.mutate({
                    wedding_hall_id: props.toyxonaId,
                    status: 'review'
                }, {
                    onSuccess: () => {
                        // Cache'ni invalidate qilish
                        queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'admin'] });
                        queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'superadmin'] });
                        queryClient.invalidateQueries({ queryKey: ['toyxona-by-id', props.toyxonaId] });
                    }
                })
            }
        }
    });
}

const { mutate: deleteTariffType, isPending: isDeleting } = useDeleteTariffType()

function removePrice(id: number) {
    deleteTariffType(id, {
        onSuccess() {
            prices.value = prices.value.filter(item => item.id !== id)
            // Narx o'chirilganda toyxona statusini review ga o'tkazish
            if (props.toyxonaId) {
                changeStatus.mutate({
                    wedding_hall_id: props.toyxonaId,
                    status: 'review'
                }, {
                    onSuccess: () => {
                        // Cache'ni invalidate qilish
                        queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'admin'] });
                        queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'superadmin'] });
                        queryClient.invalidateQueries({ queryKey: ['toyxona-by-id', props.toyxonaId] });
                    }
                })
            }
        },
        onError(error: any) {
            alert(error.message || 'Xatolik yuz berdi')
        }
    })
}
function reset() {
    state.person_count = ''
    state.price = ''
    prices.value = []
}
defineExpose({ prices, reset })
// Agar parentdan tarifId o'zgarsa, eski narxlarni tozalash (optional)
watch(() => props.tariffId, () => {
    prices.value = []
})
</script>

<template>
    <div class="flex flex-col gap-2">
        <p class="py-2 flex items-center justify-between font-semibold">
            {{ t('tariffForm.tariffPrice') }}
            <button @click="addPrice" class="text-xl px-2 py-1 rounded hover:bg-gray-100 transition"
                :disabled="isCreating">
                <span v-if="isCreating">
                    <Icon name="i-heroicons-arrow-path-20-solid" class="animate-spin" />
                </span>
                <span v-else>+</span>
            </button>
        </p>
        <!-- Inputlar -->
        <UForm :state="state" class="w-full flex items-center justify-between gap-2" @submit.prevent="addPrice">
            <UFormField class="w-1/4" :label="t('tariffForm.people')" name="person_count">
                <UInput v-model="state.person_count" v-maska="'####'" color="secondary" variant="soft" class="w-full"
                    type="text" size="xl" placeholder="1234" :disabled="isCreating" />
            </UFormField>
            <UFormField class="w-3/4" :label="t('tariffForm.price')" name="price">
                <UInput v-model="state.price" v-maska="'### ### ###'" variant="soft" class="w-full" type="text"
                    size="xl" :placeholder="t('tariffForm.price')" :disabled="isCreating" />
            </UFormField>
        </UForm>
        <!-- Narxlar ro'yxati -->
        <div v-for="item in prices" :key="item.id" class="flex items-center justify-center gap-2 w-full mb-2">
            <div class="w-1/4 flex flex-col">
                <label class="text-xs text-gray-400 mb-1">{{ t('tariffForm.people') }}</label>
                <div class="bg-gray-100 rounded-lg px-4 py-2 text-base font-bold text-gray-900 text-left">{{
                    item.person_count }}</div>
            </div>
            <div class="w-3/4 flex flex-col">
                <label class="text-xs text-gray-400 mb-1">{{ t('tariffForm.price') }}</label>
                <div class="relative w-full flex">
                    <div
                        class="bg-gray-100 w-full rounded-lg px-4 py-2 text-base font-bold text-gray-900 flex items-center justify-between pr-10">
                        <span>{{ item.price }}</span>
                    </div>
                    <UButton variant="ghost" color="neutral" @click="removePrice(item.id)"
                        class="text-red-500 hover:text-red-700">
                        <Icon name="custom:trash-icon" size="20" />
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>