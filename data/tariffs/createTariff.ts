import { useMutation } from "@tanstack/vue-query";
import $authApi from "~/http/authApi";

interface CreateTariffFormData {
    name:string,
    wedding_hall_id: number
}

export const useCreateTarif = () => { 
    return useMutation({
        mutationKey: ['createTariff'],
        mutationFn: async (formData: CreateTariffFormData) => {
            try {
                const response = await $authApi.post('tariffs/add', formData);
                return response.data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || "Tarif yaratishda muammo bo'ldi";
                throw new Error(errorMessage);
            }
        }
    }); 
}