<script lang="ts" setup>
import { useUpdateProfile } from '~/data';
import { useAuthStore } from '~/stores/auth.store';
import { openState } from '~/stores/isOpen.store'
import { vMaska } from 'maska/vue';

const openComponent = openState()
const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();
const phonePrefix = '998'; // Faqat raqam, plus belgisisiz
const user = authStore.user;
const props = defineProps<{
    onProfileUpdated?: () => void
}>();


const state = reactive({
    name: user?.name || '',
    phone: user?.phone ? user.phone.slice(-9) : '', // Inputda faqat oxirgi 9 ta raqam
});

const fullPhoneNumber = computed(() => phonePrefix + state.phone.replace(/\D/g, ''));

// Form validation
const validateForm = (): boolean => {
    if (!state.name || !state.phone) {
        toast.add({
            title: t('error.validation'),
            description: t('error.fillAllFields'),
            color: 'error',
        });
        return false;
    }
    return true;
};

// Handle successful update
const handleUpdateSuccess = async (data: any) => {
    try {
        // Save user data to store
        authStore.updateUser({
            id: String(data.user.id),
            name: data.user.name,
            phone: data.user.phone,
            status: data.user.status,
            role: data.user.role ?? authStore.user?.role,
            avatar: data.user.avatar
        });
        if (props.onProfileUpdated) {
            props.onProfileUpdated();
        }
        openComponent.onClose();
    } catch (error) {
        toast.add({
            title: t('error.title'),
            description: t('error.unknown'),
            color: 'error',
        });
    }
};

// Update mutation with UI handlers
const { mutate, isPending } = useUpdateProfile(user?.id as string);

// Forma yuborilganda
const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    const formData = {
        name: state.name.trim(),
        phone: fullPhoneNumber.value, // To‘liq formatda yuboriladi: 998901234567
        status: 'active',
        role: 1,
    };

    mutate(
        formData,
        {
            onSuccess: handleUpdateSuccess,
            onError: (error: Error) => {
                console.error('Error during profile update:', error);
                toast.add({
                    title: t('error.title'),
                    description: error.message || t('error.unknown'),
                    color: 'error',
                });
            },
        }
    );
};
</script>

<template>
    <div class="w-full md:w-2/3 lg:w-full mx-auto">
        <UForm :state="state" class="w-full flex flex-col gap-4" @submit.prevent="onSubmit">
            <!-- Name Field -->
            <UFormField class="w-full" :label="t('form.nameField')" name="name">
                <UInput v-model="state.name" class="w-full" type="text" size="xl" :placeholder="t('form.nameField')"
                    color="secondary" :disabled="isPending" />
            </UFormField>

            <!-- Phone Field -->
            <UFormField class="w-full" :label="t('form.phoneField')" name="phone">
                <div class="relative bg-white border border-gray-300 rounded-lg">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        +{{ phonePrefix }}
                    </span>
                    <UInput v-model="state.phone" v-maska="'## ### ## ##'" class="pl-20 w-full focus:outline-none"
                        size="xl" type="text" placeholder="90 123 45 67" color="secondary" :disabled="isPending" />
                </div>
            </UFormField>
            <!-- Submit Button -->
            <UButton type="submit"
                class="w-full bg-[var(--primary-color)] text-white rounded-lg py-3 text-lg font-semibold hover:bg-blue-400 transition-colors duration-200">
                {{ t('form.saveButton') }}
            </UButton>
        </UForm>
    </div>
</template>