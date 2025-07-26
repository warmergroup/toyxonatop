<script lang="ts" setup>
import { useAttachRole } from '~/data';
import { vMaska } from 'maska/vue';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import type { AttachRoleFormData } from '~/interfaces';
import { useToast } from '#imports';

const { t } = useI18n();
const toast = useToast();

const phonePrefix = '+998';
const phoneCode = '998';

const roleItems = [
    { label: 'Admin', value: 1 },
    { label: 'Superadmin', value: 2 },
];


const state = reactive<AttachRoleFormData>({
    phone: '',
    role: 1,
});

const schema = z.object({
    phone: z.string()
        .min(1, t('validation.phoneRequired'))
        .refine(
            (value) => value.replace(/\D/g, '').length === 9,
            t('validation.phoneInvalid')
        ),
    role: z.number({ required_error: t('validation.roleRequired') }),
});

type Schema = z.infer<typeof schema>;

const emit = defineEmits(['success']);

const { mutate, isPending } = useAttachRole();

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    const formData: AttachRoleFormData = {
        phone: phoneCode + event.data.phone.replace(/\D/g, ''),
        role: event.data.role,
    };

    mutate(formData, {
        onSuccess: () => {
            state.phone = '';
            state.role = 1;
            emit('success');
        },
        onError: (error: unknown) => {
            if (error instanceof Error && error.message.includes('already exists')) {
                toast.add({
                    title: t('error.title'),
                    description: t('error.adminAlreadyExists'),
                    color: 'warning',
                });
                return;
            } else if (error instanceof Error && error.message.includes('User not found')) {
                toast.add({
                    title: t('error.title'),
                    description: t('error.userNotFound'),
                    color: 'warning',
                });
                return;
            } else {
                toast.add({
                    title: t('error.title'),
                    description: error instanceof Error ? error.message : t('error.unknown'),
                    color: 'error',
                });
            }

        },
    });
};
</script>

<template>
    <UForm :schema="schema" :state="state" class="w-full bg-white rounded-xl p-4 flex flex-col gap-4"
        @submit="onSubmit">
        <!-- Phone Field -->
        <UFormField class="w-full text-base font-normal" :label="t('form.phoneField')" name="phone">
            <div class="relative border border-gray-300 rounded-lg">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {{ phonePrefix }}
                </span>
                <UInput variant="soft" v-model="state.phone" v-maska="'## ### ## ##'" class="pl-20 w-full" size="xl"
                    type="text" placeholder="90 123 45 67" color="secondary" :disabled="isPending" />
            </div>
        </UFormField>

        <!-- Role Field -->
        <UFormField class="w-full text-base font-normal" :label="t('form.roleField')" name="role">
            <USelect class="w-full" variant="soft" v-model="state.role" :items="roleItems" option-attribute="label"
                :disabled="isPending" />
        </UFormField>

        <!-- Submit Button -->
        <UButton
            class="w-full bg-[var(--primary-color)] text-white rounded-lg py-3 text-lg font-semibold hover:bg-blue-400 transition-colors duration-200"
            type="submit" size="xl" :label="t('form.saveButton')" :loading="isPending" :disabled="isPending" />
    </UForm>
</template>