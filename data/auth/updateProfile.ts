import $authApi  from '~/http/authApi';
import { useMutation } from '@tanstack/vue-query';
import $axios from '~/http';
import type { IRegisterResponse } from '~/interfaces';

interface RegisterFormData {
  name: string;
  phone: string;
  status: string;
  role: number;
}

export const useUpdateProfile = (userId:string) => {
  return useMutation({
    mutationKey: ['updateProfile'],
    mutationFn: async (formData: RegisterFormData) => {
      try {
        const response = await $authApi.put<IRegisterResponse>(`users/update/${userId}`, formData);
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        console.error('Update Profile Error:', error);
        throw new Error(errorMessage);
      }
    } 
  });
};