import $authApi  from '~/http/authApi';
import { useMutation } from '@tanstack/vue-query';

interface UpdateTarifName {
    name: string
    wedding_hall_id: number
}

export const useUpdateTariffName = (tariff_id:number) => {
    return useMutation({
        mutationKey: ['update-tarif-name'],
        mutationFn: async (formData: UpdateTarifName) => {
            try {
                const response = await $authApi.put(`tariffs/update/${tariff_id}`, formData)
                return response.data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || "Tarif yaratishda muammo bo'ldi";
                throw new Error(errorMessage);
            }
        }
    })
} 