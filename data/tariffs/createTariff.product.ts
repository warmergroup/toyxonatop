import { useMutation } from "@tanstack/vue-query";
import $authApi from "~/http/authApi";

interface CreateTariffFormData {
    tariff_id: number,
    type: string, //meals, salads, wedding_table, bonuses
    name: string,
    description: string,
    image_url: string
    category_id:number
}

export const useCreateTariffProduct = () => { 
    return useMutation({
        mutationKey: ['create-Tariff-Product'],
        mutationFn: async (formData: CreateTariffFormData) => {
            try {
                const response = await $authApi.post('tariff-products/add', formData);
                return response.data;
            } catch (error: any) {
                // API error handling
                const errorMessage = error.response?.data?.message || "Maxsulotlarni yaratishda xatolik bo'ldi";
                throw new Error(errorMessage);
            }
        }
    }); 
}