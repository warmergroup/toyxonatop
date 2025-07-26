import { useMutation } from '@tanstack/vue-query';
import { getFCMToken } from '~/utils/firebase';
import $axios from '~/http';
import type { IRegisterResponse } from '~/interfaces';

interface RegisterFormData {
  name: string;
  phone: string;
  status: string;
  role: number;
}

export const useRegister = (vapidKey?: string) => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (formData: RegisterFormData) => {
      const fcmToken = process.client ? await getFCMToken(vapidKey) : null;
      const payload = { ...formData, fcm_token: fcmToken };
      try {
        const response = await $axios.post<IRegisterResponse>('register', payload);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        throw new Error(errorMessage);
      }
    }
  });
};