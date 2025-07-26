<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

const { t } = useI18n()
const authStore = useAuthStore()

const props = defineProps<{
    show?: boolean
}>()

const shouldShow = computed(() => {
    return authStore.isAdmin && (props.show !== false)
})
</script>

<template>
    <div v-if="shouldShow"
        class="fixed w-full rounded-lg bottom-16 lg:bottom-0 right-[50%] translate-x-[50%] md:w-1/4 lg:w-1/4  z-50 flex flex-col gap-4 p-4 bg-white border-t border-gray-200">
        <UButton class="flex items-center justify-center" color="secondary" :label="t('admin.editButton')" />
    </div>
</template>