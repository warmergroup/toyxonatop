<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

const { t } = useI18n()
const authStore = useAuthStore()

// Props qo'shamiz
const props = defineProps<{
    status?: string
}>()

const emit = defineEmits(['reject', 'accept'])

function acceptVenue() {
    emit('accept')
}
function rejectVenue() {
    emit('reject')
}

// Statusga qarab disable holatini aniqlash
const isAccepted = computed(() => props.status === 'active')
const isRejected = computed(() => props.status === 'rejected')
</script>

<template>
    <div v-if="authStore.isSuperAdmin"
        class="fixed w-full rounded-lg bottom-16 lg:bottom-0 right-[50%] translate-x-[50%] md:w-2/4 lg:w-1/4  z-50 flex flex-col gap-4 p-4 bg-white border-t border-gray-200">
        <UButton class="flex items-center justify-center" color="secondary" @click="acceptVenue" :disabled="isAccepted"
            :label="isAccepted ? t('superadmin.accepted') : t('superadmin.acceptWeddingHall')" />
        <UButton class="flex items-center justify-center" variant="soft" color="error" @click="rejectVenue"
            :disabled="isRejected" :label="isRejected ? t('superadmin.rejected') : t('superadmin.rejectWeddingHall')" />
    </div>
</template>