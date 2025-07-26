<script setup lang="ts">

const { t } = useI18n()
</script>
<template>
    <div class="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 aspect-video">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11a4 4 0 118 0 4 4 0 01-8 0z" />
        </svg>
        <span>{{ t('common.noImage') }}</span>
    </div>
</template>