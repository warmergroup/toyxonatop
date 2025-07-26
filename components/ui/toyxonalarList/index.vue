<script setup lang="ts">
import { useInfiniteToyxonalarQuery } from '~/data'
import { useAuthStore } from '~/stores/auth.store'
import { openState } from '~/stores/isOpen.store'
import { useQueryClient } from '@tanstack/vue-query'
import { nextTick } from 'vue'


const localePath = useLocalePath()
const router = useRouter()
const { t } = useI18n();
const { formatPrice } = useFormat()
const infiniteScrollTrigger = ref<null | HTMLElement>(null);
const authStore = useAuthStore();
const role = computed(() => authStore.isSuperAdmin ? 'superadmin' : (authStore.isAdmin ? 'admin' : ''));
const openComponent = openState();
const queryClient = useQueryClient();
let observer: IntersectionObserver | null = null;

const emit = defineEmits<{
    (e: 'action', toyxona: any, tab: string): void
}>()

const { data: toyxonalarData, isLoading: toyxonaLoading,
    fetchNextPage, isFetchingNextPage, error, refetch
} = useInfiniteToyxonalarQuery(12, 'admin');

const toyxonalar = computed(() => (toyxonalarData.value?.pages || []).flat())
const items = computed(() => {
    if (role.value === 'admin') {
        return [
            { label: t('weddingHallStatus.active'), slot: 'active' },
            { label: t('weddingHallStatus.arxiv'), slot: 'archive' }
        ]
    } else if (role.value === 'superadmin') {
        return [
            { label: t('weddingHallStatus.all'), slot: 'all' },
            { label: t('weddingHallStatus.moderation'), slot: 'moderation' }
        ]
    } else { return [] }
});

const filteredToyxonalar = (slot: string) => {
    if (role.value === 'admin') {
        if (slot === 'active') return toyxonalar.value.filter(t => t.status === 'active' || t.status === 'new' || t.status === 'review');
        if (slot === 'archive') return toyxonalar.value.filter(t => t.status === 'arxiv' || t.status === 'rejected');
    } else if (role.value === 'superadmin') {
        if (slot === 'all') return toyxonalar.value;
        if (slot === 'moderation') return toyxonalar.value.filter(t => t.status === 'review');
    } else {
        return [];
    }
    return [];
};

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    arxiv: 'bg-orange-200 text-gray-600',
    new: 'bg-yellow-100 text-yellow-700',
    review: 'bg-blue-100 text-blue-600',
    moderation: 'bg-blue-100 text-blue-600'
};


onMounted(() => {
    observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage.value) {
            fetchNextPage();
        }
    });
    if (infiniteScrollTrigger.value) {
        observer.observe(infiniteScrollTrigger.value);
    }
});

onUnmounted(() => {
    if (infiniteScrollTrigger.value && observer) observer.unobserve(infiniteScrollTrigger.value);
    if (observer) observer.disconnect();
});

const infoFields = [
    { label: 'admin.tarifCount', value: (t: any, toyxona: any) => toyxona.tariff_count },
    { label: 'admin.minPrice', value: (t: any, toyxona: any) => formatPrice(toyxona.min_price) },
    { label: 'admin.maxPrice', value: (t: any, toyxona: any) => formatPrice(toyxona.max_price) }
];

function refreshList() {
    // Cache'ni invalidate qilish va yangi ma'lumotlarni olish
    queryClient.invalidateQueries({ queryKey: ['venues-infinite', 'admin'] });
    // Keyin refetch qilamiz
    nextTick(() => {
        queryClient.refetchQueries({ queryKey: ['venues-infinite', 'admin'] });
        refetch();
    });
}
defineExpose({ refreshList })

const navigateToVenue = (id: string) => {
    const path = localePath(`/admin/toyxona/${id}`);
    router.push(path);
};
</script>

<template>
    <div class="mb-20">
        <UTabs :items="items" size="xl" :ui="{
            list: 'bg-gray-200',
            indicator: 'bg-white',
            trigger: 'data-[state=active]:text-default',
            content: '',
            label: 'text-md'
        }">
            <template v-for="tab in items" #[tab.slot]="{ item }">
                <div class="flex flex-col gap-4">
                    <div v-for="toyxona in filteredToyxonalar(tab.slot)" :key="toyxona.id"
                        class="relative p-4 rounded-lg bg-gray-50 flex flex-col gap-4 hover:shadow">
                        <div class="flex p-0 flex-col gap-2 relative cursor-pointer"
                            @click="navigateToVenue(toyxona.id)">
                            <h3 class="text-lg font-bold hover:text-blue-400 transition-all ease-in">{{
                                toyxona.name }}</h3>
                            <span class="w-fit py-1 px-3 text-xs font-medium rounded-md"
                                :class="statusColors[toyxona.status] || 'bg-gray-100 text-gray-600'">
                                {{ t('weddingHallStatus.' + toyxona.status) }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <template v-for="(field, idx) in infoFields" :key="field.label">
                                <div class="flex flex-col items-start justify-center">
                                    <p class="text-sm">{{ t(field.label) }}</p>
                                    <span class="text-base font-medium">{{ field.value(t, toyxona) }}</span>
                                </div>
                                <USeparator v-if="idx < infoFields.length - 1" class="h-10" orientation="vertical" />
                            </template>
                        </div>
                        <div v-if="role === 'admin'"
                            class="absolute right-4 top-4 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
                            @click="emit('action', toyxona, tab.slot)">
                            <Icon size="20px" name="custom:x-action" />
                        </div>
                    </div>
                    <!-- Scroll trigger -->
                    <div ref="infiniteScrollTrigger"></div>
                </div>
            </template>
        </UTabs>
        <template v-if="role === 'admin'">
            <div
                class="container mx-auto absolute bottom-0 left-0 right-0 flex items-center justify-center bg-white w-full min-h-16 border-t border-gray-300 px-5 py-3 z-30">
                <UButton class="w-full flex items-center justify-center" color="secondary" size="xl" icon="custom:plus"
                    :label="t('admin.addWeddingHall')" @click="openComponent.onOpen('addToyxona')" />
            </div>
        </template>
    </div>
</template>
