import { useMutation } from "@tanstack/vue-query";
import $authApi from "~/http/authApi";

export const useDeleteToyxonaImage = () => {
    return useMutation({
        mutationKey: ["delete-toyxonaImage"],
        mutationFn: async (image_id: number | string) => {
            return $authApi.delete(`/wedding-hall-pictures/delete/${image_id}`)
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'Failed to delete weddinghall image';
            throw new Error(errorMessage);
        }
    })
}