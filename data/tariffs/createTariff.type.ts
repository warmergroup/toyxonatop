import { useMutation } from "@tanstack/vue-query";
import $authApi from "~/http/authApi";

interface CreateTariffFormData {
    tariff_id: number,
    person_count:number,
    price: number
}

export const useCreateTariffType = () => { 
    return useMutation({
        mutationKey: ['createTariffType'],
        mutationFn: async (formData: CreateTariffFormData) => {
            try {
                const response = await $authApi.post('tariff-types/add', formData);
                return response.data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || "Tarif narxlarini yaratishda mummo bo'ldi";
                throw new Error(errorMessage);
            }
        }
    }); 
}