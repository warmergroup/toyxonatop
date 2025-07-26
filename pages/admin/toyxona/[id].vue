<script setup lang="ts">
definePageMeta({
    middleware: ['admin-or-superadmin']
})

import { useAuthStore } from '~/stores/auth.store'
import type { IToyxonalar } from '~/interfaces';
import { useLocationStore } from '~/stores/location.store';
import { getDistanceFromLatLonInKm } from '~/utils/distance'
import { getToyxonaById } from '~/data/toyxonalar';
import type { UseQueryReturnType } from '@tanstack/vue-query';
import { openState } from '~/stores/isOpen.store';
import { useChangeToyxonaStatus } from '~/data'
import { useQueryClient } from '@tanstack/vue-query';

const auth = useAuthStore();
const openComponent = openState();
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const { isLargeScreen } = useScreenSize();
const locationStore = useLocationStore()
const changeStatus = useChangeToyxonaStatus()
const queryClient = useQueryClient();
const toyxonaQuery = getToyxonaById(route.params.id as string) as UseQueryReturnType<IToyxonalar, Error>;
const toyxona = toyxonaQuery.data;
const error = ref<string | null>(null);
const selectedTarif = ref<any | null>(null);
const isEditTariffOpen = ref(false);
const isRejectDrawerOpen = ref(false)
const toast = useToast()

const goback = () => {
    router.go(-1);
};
const onClose = () => {
    openComponent.onClose();
}
function handleEditClose() {
    openComponent.onClose();
    setTimeout(() => {
        if (toyxonaQuery && typeof toyxonaQuery.refetch === 'function') {
            toyxonaQuery.refetch();
        }
    }, 300);
}
const userDistance = computed(() => {
    if (
        locationStore.coords &&
        toyxona.value &&
        toyxona.value.latitude &&
        toyxona.value.longitude
    ) {
        return getDistanceFromLatLonInKm(
            locationStore.coords.latitude,
            locationStore.coords.longitude,
            Number(toyxona.value.latitude),
            Number(toyxona.value.longitude)
        )
    }
    return null
})

const imagelItems = computed(() =>
    (toyxona?.value?.wedding_hall_pictures as any[] || []).map(b => ({
        src: b.image_url,
        id: b.id,
        wedding_hall_id: b.wedding_hall_id
    }))
)


const tariflarForCard = computed(() =>
    Array.isArray(toyxona.value?.tariffs)
        ? toyxona.value.tariffs.map((tarif: any) => ({
            ...tarif,
            tariff_types: tarif.tariff_types || []
        }))
        : []
);


// Open tariff details (view mode)
const openTarifSlide = (tarif: any) => {
    selectedTarif.value = tarif;
    openComponent.onOpen('showTariff');
};

// Open tariff edit (edit mode)
const openTarifEdit = (tarif: any) => {
    selectedTarif.value = tarif;
    isEditTariffOpen.value = true;
};


function handleAccept() {
    if (!toyxona.value) return
    changeStatus.mutate({
        wedding_hall_id: toyxona.value.id,
        status: 'active',
        reject_reason: ''
    }, {
        onSuccess: () => {
            toast.add({
                description: `${t('superadmin.accepted')}`,
                color: 'success',
            })
            // Cache'ni invalidate qilish va listni yangilash
            queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'superadmin'] });
        },
        onError: (err) => {
            toast.add({
                title: t('error.title'),
                description: (err.message),
                color: 'error',
            })
        }
    })
}

function handleReject(reason: string) {
    if (!toyxona.value) return
    changeStatus.mutate({
        wedding_hall_id: toyxona.value.id,
        status: 'rejected',
        reject_reason: reason
    }, {
        onSuccess: () => {
            toast.add({
                description: `${t('superadmin.rejected')}`,
                color: 'success',
            })
            isRejectDrawerOpen.value = false
            // Cache'ni invalidate qilish va listni yangilash
            queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'admin'] });
            queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'superadmin'] });
        },
        onError: (err) => {
            toast.add({
                title: t('error.title'),
                description: (err.message),
                color: 'error',
            })
        }
    })
}

const isAdmin = computed(() => auth.isAdmin);
const isSuperAdmin = computed(() => auth.isSuperAdmin);
const showFullDescription = ref(false);
const DESCRIPTION_LIMIT = 180;
const shortDescription = computed(() => {
    if (!toyxona.value?.description) return '';
    return toyxona.value.description.length > DESCRIPTION_LIMIT
        ? toyxona.value.description.slice(0, DESCRIPTION_LIMIT)
        : toyxona.value.description;
});
const isTruncated = computed(() => {
    return toyxona.value?.description && toyxona.value.description.length > DESCRIPTION_LIMIT;
});
function toggleDescription() {
    showFullDescription.value = !showFullDescription.value;
}

</script>

<template>
    <div v-if="error" class="flex items-center justify-center h-64">
        <p class="text-text-secondary">{{ error }}</p>
    </div>
    <div v-else-if="toyxona" class="relative lg:px-5 lg:py-20 w-full h-full"
        :class="isSuperAdmin ? 'pb-50 lg:pb-30' : 'pb-20'">

        <div class="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
            <!-- Chap ustun (2/3) -->
            <div class="flex flex-col lg:gap-4 lg:col-span-2 lg:rounded-lg w-full h-full bg-white">
                <template v-if="isLargeScreen">
                    <UiThumbnailGallery class="px-3 pt-3" :toyxona="toyxona" />
                </template>

                <div v-if="!isLargeScreen" ref="imageRef" class="sticky top-0 w-full h-auto">
                    <div class="relative">
                        <UiCarousel
                            v-if="toyxona && Array.isArray(toyxona.wedding_hall_pictures) && toyxona.wedding_hall_pictures.length > 1"
                            :items="imagelItems" :rounded="false" :arrows="false" />
                        <NuxtImg v-else-if="toyxona && toyxona.wedding_hall_pictures.length > 0"
                            :src="toyxona.wedding_hall_pictures[0].image_url" :alt="toyxona.name"
                            class="w-full aspect-video object-cover" />
                        <UiNoImage v-else class="w-full aspect-video" />
                        <div
                            class="absolute w-full h-full top-0 left-0 p-3 inset-0 pointer-events-none bg-gradient-to-b from-black to-transparent opacity-30">
                            <div class="flex items-center justify-between pointer-events-auto">
                                <span
                                    class="z-10 w-[36px] h-[36px] backdrop-blur-md bg-white/50 rounded-full p-2 cursor-pointer flex items-center justify-center border border-white"
                                    @click="goback()">
                                    <Icon class="text-white" name="custom:arrow-back" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-3 p-3 z-10 bg-white rounded-t-2xl">
                    <div>
                        <h1 class="font-bold text-xl">{{ toyxona.name }}</h1>
                        <p class="font-medium text-sm">{{ toyxona.address }}</p>
                        <p v-if="userDistance" class="text-text-secondary">
                            {{ userDistance.toFixed(1) }} km {{ t('common.fromYou') }}
                        </p>
                    </div>

                    <!-- Tariffs -->
                    <h2 class="font-medium text-lg text-text-primary">{{ t('weddingHall.tariffs') }}</h2>
                    <UiTarifCard v-for="tarif in tariflarForCard" :key="tarif.id" :tarif="tarif"
                        @click="openTarifSlide(tarif)" />

                </div>
            </div>
            <!-- O‘ng ustun (1/3) -->
            <div class="flex flex-col gap-4">

                <div class="relative bg-white p-4 rounded-b-lg lg:rounded-lg">
                    <h2 class="text-xl font-medium text-text-primary mb-4 capitalize ">{{ t('weddingHall.description')
                    }}
                    </h2>
                    <transition name="fade-expand">
                        <span v-if="showFullDescription" key="full"
                            class="text-gray-500 text-sm block whitespace-pre-line">
                            {{ toyxona.description }}
                        </span>
                        <span v-else key="short" class="text-gray-500 text-sm block whitespace-pre-line">
                            {{ shortDescription }}<span v-if="isTruncated">...</span>
                        </span>
                    </transition>
                    <button v-if="isTruncated" @click="toggleDescription"
                        class="text-green-500 font-medium mt-2 flex items-center gap-1 select-none">
                        <span>{{ showFullDescription ? t('common.readLess') : t('common.readMore') }}</span>
                        <svg :class="{ 'rotate-180': showFullDescription, 'transition-transform': true }" width="16"
                            height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6l4 4 4-4" stroke="#10B981" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>

                <!-- Map -->
                <div class="bg-white rounded-lg p-4">
                    <h2 class="text-xl font-medium text-text-primary mb-4 capitalize ">{{ t('weddingHall.location') }}
                    </h2>
                    <div class="bg-gray-100 rounded-lg overflow-hidden mb-4">
                        <YandexMap :center="{ lat: Number(toyxona.latitude), lng: Number(toyxona.longitude) }"
                            :title="toyxona.name" class="w-full h-48 md:aspect-video lg:h-80" />
                    </div>
                    <div class="flex flex-col text-text-secondary mb-4">
                        <p>{{ toyxona.address }}</p>
                        <span v-if="userDistance" class="text-text-secondary">
                            <Icon name="custom:location" class="inline-block mr-1" />
                            {{ userDistance.toFixed(1) }} km {{ t('common.fromYou') }}
                        </span>
                    </div>
                </div>
                <!-- contact info -->
                <div class="bg-white lg:rounded-lg shadow-sm p-4 flex flex-col gap-2">
                    <div class="flex flex-col gap-2">
                        <span>
                            {{ toyxona.phone1 }}
                        </span>
                        <span>
                            {{ toyxona.phone2 }}
                        </span>
                    </div>
                    <div class="flex items-center gap-3">
                        <NuxtLink :to="`https://t.me/${toyxona.telegram}`" target="_blank">
                            <Icon name="custom:telegram" />
                        </NuxtLink>
                        <NuxtLink :to="`https://www.instagram.com/${toyxona.instagram}`" target="_blank">
                            <Icon name="custom:instagram" />
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <div class="relative">
                <SuperadminAcceptReject :status="toyxona?.status" @reject="isRejectDrawerOpen = true"
                    @accept="handleAccept" />
                <AdminEditBtn :show="true" @click="openComponent.onOpen('editToyxona')" />
            </div>
        </div>


        <!-- Tariff details slideover (view mode) -->
        <UiSlideOver :isOpen="openComponent.isOpen && openComponent.componentType === 'showTariff'"
            :title="selectedTarif?.name || 'tarif'" @close="handleEditClose">
            <UiTarifTabs :tarif-id="selectedTarif?.id" :tariff="selectedTarif" :is-admin="auth.isAdmin"
                @edit-tariff="openTarifEdit" />
        </UiSlideOver>

        <!-- Tariff edit slideover (edit mode) -->
        <UiSlideOver :isOpen="openComponent.isOpen && openComponent.componentType === 'editTarif'"
            :title="selectedTarif?.name || 'Tarifni tahrirlash'" @close="handleEditClose">
            <div v-if="selectedTarif" class="relative flex flex-col gap-4">
                <div class="flex flex-col items-center justify-between bg-white p-4 rounded-lg">
                    <AdminTarifNameForm :toyxona-id="Number(toyxona.id)" :tariff-id="selectedTarif.id"
                        :default-name="selectedTarif.name" />
                    <AdminTarifPrices :tariff-id="selectedTarif.id" :toyxona-id="Number(toyxona.id)"
                        :initial-prices="selectedTarif.tariff_types" />
                </div>
                <AdminTarifProducts :tariff-id="selectedTarif.id" :toyxona-id="Number(toyxona.id)"
                    :initial-products="selectedTarif.products" />
                <!-- YANGI: Saqlash tugmasi -->
                <UButton class="flex items-center justify-center mt-4" color="secondary" :label="t('common.save')"
                    @click="handleEditClose" />
            </div>
        </UiSlideOver>


        <UiSlideOver :isOpen="openComponent.isOpen && openComponent.componentType === 'editToyxona'" @close="onClose">
            <AdminToyxonaEdit :toyxona="toyxona" @updated="handleEditClose" />
        </UiSlideOver>

        <UiDrawer v-if="!isLargeScreen" :isOpen="isRejectDrawerOpen" :title="t('superadmin.rejectedReason')"
            @close="isRejectDrawerOpen = false">
            <SuperadminRejectForm @submit="handleReject" />
        </UiDrawer>

        <UiSlideOver v-if="isLargeScreen" :isOpen="isRejectDrawerOpen" :title="t('superadmin.rejectedReason')"
            @close="isRejectDrawerOpen = false">
            <SuperadminRejectForm @submit="handleReject" />
        </UiSlideOver>
    </div>

    <div v-else class="mx-auto mt-50vh flex items-center justify-center h-64">
        <p class="text-text-secondary">{{ t('common.loading') }}</p>
    </div>

</template>