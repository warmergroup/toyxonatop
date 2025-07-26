import { useMutation } from "@tanstack/vue-query";
import $authApi from "~/http/authApi";
import type { ToyxonaFormData } from "~/interfaces";

export const useUpdateToyxona = (toyxona_id: number) => {
    return useMutation({
        mutationKey: ["updateToyxona"],
        mutationFn: async (formData: ToyxonaFormData) => {
            try {
                const response = await $authApi.put(`wedding-halls/update/${toyxona_id}`, formData);
                return response.data;
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || "Toyxona yangilashda muammo bo'ldi";
                console.error("Error updating toyxona:", errorMessage);
                throw new Error(errorMessage);
            }
        }
    });
};