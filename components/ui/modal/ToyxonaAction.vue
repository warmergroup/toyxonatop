<script setup lang="ts">
import { useDeleteToyxona, useChangeToyxonaStatus } from '~/data';

const { t } = useI18n();
const props = defineProps<{
    modelValue: boolean;
    toyxona: any;
    tab: 'active' | 'archive';
}>();
const emit = defineEmits(['update:modelValue', 'action-success', 'close']);
const toast = useToast();

const show = computed({
    get: () => props.modelValue,
    set: v => emit('update:modelValue', v)
});

const { mutate: deleteToyxona, isPending: isDeleting } = useDeleteToyxona();
const { mutate: changeStatus, isPending: isChanging } = useChangeToyxonaStatus();

const handleDelete = () => {
    if (!props.toyxona) return;
    deleteToyxona(props.toyxona.id, {
        onSuccess: () => {
            toast.add({ title: 'Success', description: t('weddingHallStatus.weddingHallDeleted'), color: 'primary' });
            emit('close', 'success');
        },
        onError: (e: any) => {
            toast.add({ title: t('error.title'), description: e.message, color: 'error' });
        }
    });
};

const handleArchive = () => {
    if (!props.toyxona) return;
    changeStatus({ wedding_hall_id: props.toyxona.id, status: 'arxiv' }, {
        onSuccess: () => {
            toast.add({ description: t('weddingHallStatus.weddingHallArchived'), color: 'primary' });
            emit('action-success');
            emit('close', 'success');
        },
        onError: (e: any) => {
            toast.add({ title: t('error.title'), description: e.message, color: 'error' });
        }
    });
};

// Archive tugmasi faqat active statusdagilar uchun
const canArchive = computed(() => {
    return props.toyxona?.status === 'active';
});

const handleActivate = () => {
    if (!props.toyxona) return;
    changeStatus({ wedding_hall_id: props.toyxona.id, status: 'active' }, {
        onSuccess: () => {
            toast.add({ description: t('weddingHallStatus.weddingHallActive'), color: 'primary' });
            emit('action-success');
            emit('close', 'success');
        },
        onError: (e: any) => {
            toast.add({ title: t('error.title'), description: e.message, color: 'error' });
        }
    });
};

const modalText = computed(() => {
    if (!props.toyxona) return '';
    if (props.tab === 'active') return t('modal.activeOrDelete', { name: props.toyxona?.name });
    if (props.tab === 'archive') return t('modal.archiveOrDelete', { name: props.toyxona?.name });
    return '';
});
</script>

<template>
    <UModal v-if="props.toyxona" v-model="show">

        <template #header>
            <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-center">{{ modalText }}</h3>
            </div>
        </template>

        <template #body>
            <div class="flex gap-2">
                <UButton class="w-full flex justify-center" size="xl" :label="t('common.delete')" color="neutral"
                    variant="soft" :loading="isDeleting" @click="handleDelete" />
                <UButton class="w-full flex justify-center" v-if="props.tab === 'active'" size="xl"
                    :label="t('common.archive')" :color="canArchive ? 'secondary' : 'neutral'" :loading="isChanging"
                    :disabled="!canArchive" @click="handleArchive"
                    :title="!canArchive ? t('modal.cannotArchiveReviewRejected') : ''" />
                <UButton class="w-full flex justify-center" v-if="props.tab === 'archive'" size="xl"
                    :label="t('common.activate')" color="primary" :loading="isChanging" @click="handleActivate" />
            </div>
        </template>
    </UModal>
</template>
