<script lang="ts" setup>
import { getDiscounts } from '~/data'
import { useUpdateDiscount } from '~/data/discounts/updateDiscounts'
import { useDeleteDiscount } from '~/data/discounts/deleteDiscount'
import type { Banner } from '~/interfaces'

const { formatDate } = useFormat()
const { t } = useI18n();
const toast = useToast()
const { data: banners, isLoading: isBannersLoading, refetch } = getDiscounts('admin')
const updateDiscount = useUpdateDiscount()
const deleteDiscount = useDeleteDiscount()

const loadingId = ref<string | number | null>(null)
const deletingId = ref<string | number | null>(null)

const items = [
    { label: t('weddingHallStatus.active'), slot: 'active' },
    { label: t('weddingHallStatus.arxiv'), slot: 'archive' }
]

const filteredBanners = (slot: string) => {
    if (!banners.value) return [];
    if (slot === 'active') {
        return banners.value.filter((b: Banner) =>
            (typeof b.is_active === 'string' && b.is_active === '1') ||
            (typeof b.is_active === 'boolean' && b.is_active === true)
        );
    }
    if (slot === 'archive') {
        return banners.value.filter((b: Banner) =>
            (typeof b.is_active === 'string' && b.is_active === '0') ||
            (typeof b.is_active === 'boolean' && b.is_active === false)
        );
    }
    return [];
};

function toggleStatus(banner: Banner) {
    let newStatus: string | boolean;
    let toastMsg = '';
    if (typeof banner.is_active === 'string') {
        if (banner.is_active === '1') {
            newStatus = '0';
            toastMsg = t('discount.discountArchived');
        } else {
            newStatus = '1';
            toastMsg = t('discount.discountActivated');
        }
    } else {
        if (banner.is_active === true) {
            newStatus = false;
            toastMsg = t('discount.discountArchived');
        } else {
            newStatus = true;
            toastMsg = t('discount.discountActivated');
        }
    }
    loadingId.value = banner.id
    updateDiscount.mutate(
        {
            id: banner.id,
            is_active: newStatus,
            wedding_hall_id: banner.wedding_hall_id
        },
        {
            onSuccess: () => {
                toast.add({
                    description: toastMsg,
                    color: 'success'
                })
                refetch && refetch()
            },
            onError: (err: any) => {
                toast.add({
                    title: t('error.title'),
                    description: err.message,
                    color: 'error'
                })
            },
            onSettled: () => {
                loadingId.value = null
            }
        }
    );
}

function handleDelete(banner: Banner) {
    if (!banner.id) return;
    deletingId.value = banner.id
    deleteDiscount.mutate(banner.id, {
        onSuccess: () => {
            toast.add({
                description: t('discount.discountDeleted'),
                color: 'error'
            })
            refetch && refetch()
        },
        onError: (err: any) => {
            toast.add({
                title: t('error.title'),
                description: err.message,
                color: 'error'
            })
        },
        onSettled: () => {
            deletingId.value = null
        }
    })
}

defineExpose({
    refetch
})
</script>

<template>
    <div class="flex flex-col gap-4 pb-20">
        <UTabs :items="items" size="xl" :ui="{
            list: 'bg-gray-200',
            indicator: 'bg-white',
            trigger: 'data-[state=active]:text-default',
            content: '',
            label: 'text-md'
        }">
            <template v-for="tab in items" #[tab.slot]="{ item }">
                <div v-for="banner in filteredBanners(tab.slot)" :key="banner.id"
                    class="bg-white rounded-md p-2 space-y-2">
                    <NuxtImg :src="banner.image_url" loading="lazy"
                        class="w-full aspect-video object-cover rounded-md" />
                    <div class="flex gap-2 items-center">
                        <Icon name="custom:calendar" />
                        <span class="text-sm text-gray-600">{{ formatDate(banner.created_at) }}</span>
                    </div>
                    <div class="w-full flex gap-2 items-center justify-between">
                        <!-- ACTIVE tab: o'chirish va arxivlash -->
                        <template v-if="tab.slot === 'active'">
                            <UButton color="neutral" variant="soft" size="xl"
                                class="w-full flex items-center justify-center" :label="t('common.delete')"
                                :disabled="deletingId === banner.id || loadingId === banner.id"
                                :loading="deletingId === banner.id" @click="handleDelete(banner)" />
                            <UButton color="warning" variant="soft" size="xl"
                                class="w-full flex items-center justify-center" :label="t('common.archive')"
                                :disabled="loadingId === banner.id || deletingId === banner.id"
                                :loading="loadingId === banner.id" @click="toggleStatus(banner)" />
                        </template>
                        <!-- ARCHIVE tab: o'chirish va aktivelash -->
                        <template v-else>
                            <UButton color="neutral" variant="soft" size="xl"
                                class="w-full flex items-center justify-center" :label="t('common.delete')"
                                :disabled="deletingId === banner.id || loadingId === banner.id"
                                :loading="deletingId === banner.id" @click="handleDelete(banner)" />
                            <UButton color="success" variant="soft" size="xl"
                                class="w-full flex items-center justify-center" :label="t('common.activate')"
                                :disabled="loadingId === banner.id || deletingId === banner.id"
                                :loading="loadingId === banner.id" @click="toggleStatus(banner)" />
                        </template>
                    </div>
                </div>
            </template>
        </UTabs>
        <div
            class="container mx-auto absolute bottom-0 left-0 right-0 flex items-center justify-center bg-white w-full min-h-16 border-t border-gray-300 px-5 py-3 z-30">
            <UButton class="w-full flex items-center justify-center" color="secondary" size="xl" icon="custom:plus"
                :label="t('profileActions.addDiscounts')" @click="$emit('add-discounts')" />
        </div>
    </div>
</template>