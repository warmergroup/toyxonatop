<script setup lang="ts">
const { t } = useI18n();

const formattedDescription = computed(() => {
    return t('about.description').replace(/\n/g, '<br>');
});
</script>

<template>
    <div class="space-y-4">
        <NuxtImg src="/aboutImage.png" class="w-full rounded-xl" />
        <p class="whitespace-pre-line flex items-center" v-html="formattedDescription"></p>
    </div>
</template>