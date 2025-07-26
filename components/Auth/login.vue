<script lang="ts" setup>
import { useLogin } from '~/data';
import { useAuthStore } from '~/stores/auth.store';
import { openState } from '~/stores/isOpen.store';
import { vMaska } from 'maska/vue';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

// VAPID key'ni faqat client-side'da olish
const vapidKey = process.client ? useRuntimeConfig().public.vapidKey : undefined;
const authType = useAuthType();
const openComponent = openState();
const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();

const phonePrefix = '+998'; // UI uchun
const phoneCode = '998';  // Backend uchun

const state = reactive({
    phone: '',
});

// Custom validation schema for phone with mask
const schema = z.object({
    phone: z.string()
        .min(1, t('validation.phoneRequired'))
        .refine(
            (value) => value.replace(/\D/g, '').length === 9,
            t('validation.phoneInvalid')
        )
});

type Schema = z.infer<typeof schema>;

// Handle successful login
const handleLoginSuccess = (data: { user: any; token: string }) => {
    try {
        // Save user data to store
        authStore.setUser({
            id: String(data.user.id),
            name: data.user.name,
            phone: data.user.phone,
            status: data.user.status,
            role: data.user.role,
        });

        // Save token (faqat client-side'da)
        if (process.client) {
            localStorage.setItem('token', data.token);
        }

        // Show success message
        toast.add({
            description: t('login.welcomeBack', { name: data.user.name }),
            color: 'primary',
        });

        // Close login form
        openComponent.onClose();
    } catch (error) {
        console.error('Error handling login success:', error);
        toast.add({
            description: t('error.unknown'),
            color: 'error',
        });
    }
};

// Login mutation
const { mutate, isPending } = useLogin(vapidKey);

// Form submission handler
const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    const formData = {
        phone: phoneCode + event.data.phone.replace(/\D/g, ''),
    };

    mutate(formData, {
        onSuccess: handleLoginSuccess,
        onError: (error: unknown) => {
            toast.add({
                description: error instanceof Error ? error.message : t('error.unknown'),
                color: 'error',
            });
        },
    });
};

// Validation events directly in template
</script>

<template>
    <div>
        <h2 class="text-3xl font-bold mb-4">{{ t('login.loginTitle') }}</h2>
        <UForm :schema="schema" :state="state" class="w-full flex flex-col gap-4" @submit="onSubmit">
            <!-- Phone Field -->
            <UFormField class="w-full" :label="t('form.phoneField')" name="phone">
                <div class="relative bg-white border border-gray-300 rounded-lg">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {{ phonePrefix }}
                    </span>
                    <UInput v-model="state.phone" v-maska="'## ### ## ##'" class="pl-20 w-full" size="xl" type="text"
                        placeholder="90 123 45 67" color="secondary" :disabled="isPending" />
                </div>
            </UFormField>

            <!-- Submit Button -->
            <UButton
                class="w-full bg-[var(--primary-color)] text-white rounded-lg py-3 text-lg font-semibold hover:bg-blue-400 transition-colors duration-200"
                type="submit" size="xl" :label="t('form.saveButton')" :loading="isPending" :disabled="isPending" />

            <div class="text-xl text-neutral-500">
                {{ t('login.noAccount') }}
                <span role="button" class="text-blue-500 hover:underline" @click="authType.setAuthType('register')">
                    {{ t('register.registerTitle') }}
                </span>
            </div>
        </UForm>
    </div>
</template>
