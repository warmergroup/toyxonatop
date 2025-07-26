<script setup lang="ts">
const emit = defineEmits(['submit'])

const { t } = useI18n()
const state = reactive({
    reject_reason: '',
})

function submitForm() {
    emit('submit', state.reject_reason)
}
</script>

<template>
    <div class="flex flex-col pb-10 gap-4">
        <div class="flex flex-col gap-2">
            <span>{{ t('superadmin.rejectedReason') }}</span>
            <UTextarea v-model="state.reject_reason" variant="soft" class="shadow rounded-lg" autoresize
                :placeholder="t('superadmin.rejectedPlaceholder')" />
        </div>
        <UButton @click="submitForm" class="flex justify-center rounded-lg" color="secondary" size="xl"
            :label="t('superadmin.sendReason')" />
    </div>
</template>