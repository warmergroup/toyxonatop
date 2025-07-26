<script setup lang="ts">
    const { t } = useI18n();
</script>

<template>
    <div
        class="container mx-auto absolute bottom-0 left-0 right-0 flex items-center justify-center bg-white w-full min-h-16 border-t border-gray-300 px-5 py-3 z-30">
        <UButton class="w-full flex items-center justify-center" color="secondary" size="xl" icon="custom:plus"
            :label="t('admin.addWeddingHall')" />
    </div>
</template>