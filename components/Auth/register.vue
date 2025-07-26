<script lang="ts" setup>
import { useRegister } from '~/data';
import { useAuthStore } from '~/stores/auth.store';
import { openState } from '~/stores/isOpen.store'
import { vMaska } from 'maska/vue';

// VAPID key'ni faqat client-side'da olish
const vapidKey = process.client ? useRuntimeConfig().public.vapidKey : undefined;

const authType = useAuthType();
const openComponent = openState()
const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();

const phonePrefix = '+998';

const state = reactive({
  name: '',
  phone: '',
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

// Handle successful registration
const handleRegistrationSuccess = (data: any) => {
  try {
    // Save user data to store
    authStore.setUser({
      id: String(data.user.id),
      name: data.user.name,
      phone: data.user.phone,
      status: data.user.status,
      role: data.role,
    });

    // Save token (faqat client-side'da)
    if (process.client) {
      localStorage.setItem('token', data.token);
    }

    // Show success message
    toast.add({
      description: t('register.toastMessage', { name: state.name }),
      color: 'success',
    });

    // Close registration form
    openComponent.onClose();
  } catch (error: any) {
    console.error('Error handling registration success:', error);
    toast.add({
      description: t('error.unknown') + error.message,
      color: 'error',
    });
  }
};

// Registration mutation with UI handlers
const { mutate, isPending } = useRegister(vapidKey);

const onSubmit = async (event: SubmitEvent) => {
  event.preventDefault();
  if (!validateForm()) return;

  const formData = {
    name: state.name.trim(),
    phone: fullPhoneNumber.value,
    status: 'active',
    role: 1,
  };

  mutate(formData, {
    onSuccess: handleRegistrationSuccess,
    onError: (error: Error) => {
      toast.add({
        description: error.message || t('error.unknown'),
        color: 'error',
      });
    },
  });
};

</script>

<template>
  <div>
    <h2 class="text-3xl font-bold mb-4">{{ t('register.registerTitle') }}</h2>
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
            {{ phonePrefix }}
          </span>
          <UInput v-model="state.phone" v-maska="'## ### ## ##'" class="pl-20 w-full" size="xl" type="text"
            placeholder="90 123 45 67" color="secondary" :disabled="isPending" />
        </div>
      </UFormField>
      <!-- Submit Button -->
      <UButton type="submit"
        class="w-full bg-[var(--primary-color)] text-white rounded-lg py-3 text-lg font-semibold hover:bg-blue-400 transition-colors duration-200">
        {{ t('form.saveButton') }}
      </UButton>
      <div class="text-xl text-neutral-500">
        {{ t('register.alreadyHaveAccount') }}
        <span role="button" class="text-blue-500 hover:underline" @click="authType.setAuthType('login')">{{
          t('login.loginTitle') }}</span>
      </div>
    </UForm>
  </div>
</template>
