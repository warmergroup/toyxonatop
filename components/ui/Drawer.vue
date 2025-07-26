<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    isOpen: {
        type: Boolean,
        default: false,
    }
});

const emit = defineEmits(["close"]);

function closeDrawer() {
    emit("close");
}
</script>
<template>
    <UDrawer :open="isOpen" :title="title" @close="closeDrawer">
        <template #header>
            <div class="w-full flex items-center justify-between">
                <h2 class="text-2xl font-bold">{{ title }}</h2>
            </div>
        </template>
        <template #body>
            <slot />
        </template>
    </UDrawer>
</template>
