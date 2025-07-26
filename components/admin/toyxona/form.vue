<script setup lang="ts">
    import { vMaska } from 'maska/vue';

    const { t } = useI18n();

    const props = defineProps({
        modelValue: {
            type: Object,
            required: true
        }
    });

    const emit = defineEmits(['update:modelValue']);

    // Two-way binding with parent via computed
    const state = computed({
        get: () => props.modelValue,
        set: (val) => emit('update:modelValue', val)
    });
</script>

<template>
    <div class="p-4 flex flex-col items-center justify-center bg-white rounded-xl">
        <UForm :state="state" class="w-full flex flex-col gap-4">
            <UFormField class="w-full" :label="t('weddingHallForm.nameField')" name="name">
                <UInput class="w-full" variant="soft" v-model="state.name" type="text" size="xl"
                    :placeholder="t('weddingHallForm.nameField')" />
            </UFormField>
            <UFormField class="w-full" :label="t('weddingHallForm.descriptionField')" name="description">
                <UTextarea :placeholder="t('weddingHallForm.descriptionField')" variant="soft" color="neutral"
                    v-model="state.description" autoresize class="w-full" />
            </UFormField>
            <UFormField class="w-full" :label="t('weddingHallForm.tariffsField')" name="tariff_count">
                <UInput class="w-full" v-model="state.tariff_count" v-maska="'#'" variant="soft" type="text" size="xl"
                    :placeholder="t('weddingHallForm.tariffsField')" />
            </UFormField>

            <UFormField class="w-full" :label="t('weddingHallForm.phone1Field')" name="phone1">
                <UInput icon="custom:prefix-number" v-model="state.phone1" v-maska="'## ### ## ##'" variant="soft"
                    class="w-full pl-20" size="xl" type="text" placeholder="90 123 45 67" />
            </UFormField>

            <UFormField class="w-full" :label="t('weddingHallForm.phone2Field')" name="phone2">
                <UInput icon="custom:prefix-number" v-model="state.phone2" v-maska="'## ### ## ##'" variant="soft"
                    class="w-full pl-20" size="xl" type="text" placeholder="90 123 45 67" />
            </UFormField>

            <UFormField class="w-full" :label="t('weddingHallForm.telegramField')" name="telegram">
                <UInput class="w-full" v-model="state.telegram" type="text" size="xl" placeholder="t.me/"
                    variant="soft" />
            </UFormField>

            <UFormField class="w-full" :label="t('weddingHallForm.instagramField')" name="instagram">
                <UInput class="w-full" v-model="state.instagram" variant="soft" type="text" size="xl"
                    placeholder="www.instagram.com/..." />
            </UFormField>
        </UForm>
    </div>
</template>
