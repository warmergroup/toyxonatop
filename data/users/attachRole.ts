import { useMutation } from '@tanstack/vue-query';
import $authApi from '~/http/authApi';
import type { AttachRoleFormData } from '~/interfaces';

export const useAttachRole = () => {
    return useMutation({
        mutationKey: ['attach-role'],
        mutationFn: async (formData: AttachRoleFormData) => {
            try {
                const { data } = await $authApi.post('users/attach-role', formData);
                return data;
            } catch (error:any) {
                const errorMessage = error.response?.data?.message || 'Failed to attach role';
                throw new Error(errorMessage);
            }
        }
    });
};
