<script setup lang="ts">
defineProps<{
    label: string
}>();
</script>

<template>
    <div>
        <button
            class="flex w-full items-center justify-center px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-blue-700 transition-colors"
            @click.stop="$emit('click')">
            <span>{{ label }}</span>
        </button>
    </div>
</template>