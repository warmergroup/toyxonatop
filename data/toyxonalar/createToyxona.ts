import { useMutation } from '@tanstack/vue-query';
import $authApi from '~/http/authApi';
import type { ToyxonaFormData } from '~/interfaces';


export const useCreateToyxona = () => { 
    return useMutation({
        mutationKey: ['createToyxona'],
        mutationFn: async (formData: ToyxonaFormData) => {
            try {
                const response = await $authApi.post('wedding-halls/store', formData);
                
                return response.data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Toyxona yaratish muvaffaqiyatsiz';
                throw new Error(errorMessage);
            }
        }
    }); 
}