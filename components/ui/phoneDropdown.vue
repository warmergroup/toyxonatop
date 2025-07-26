<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
const { t } = useI18n()
const props = defineProps<{
    phone1: string | null
    phone2: string | null
}>()

const dropdownItems = computed<DropdownMenuItem[]>(() => [
    ...(props.phone1
        ? [{
            label: props.phone1,
            icon: 'i-lucide-phone',
            to: `tel:${props.phone1}`,
            target: '_self'
        }]
        : []),
    ...(props.phone2
        ? [{
            label: props.phone2,
            icon: 'i-lucide-phone',
            to: `tel:${props.phone2}`,
            target: '_self'
        }]
        : [])
])
</script>
<template>
    <UDropdownMenu v-if="dropdownItems.length > 1" :items="dropdownItems"
        :content="{ align: 'end', side: 'top', sideOffset: 10 }" :ui="{ content: 'w-96 p-2 gap-8' }">
        <UButton class="w-full flex items-center justify-center" color="secondary" size="xl"
            :label="t('common.contact')" icon="i-lucide-phone" />
    </UDropdownMenu>

    <UButton v-else-if="dropdownItems.length === 1" :href="`tel:${dropdownItems[0].label}`"
        class="w-full flex items-center justify-center" color="secondary" size="xl" :label="t('common.contact')"
        icon="i-lucide-phone" />
</template>