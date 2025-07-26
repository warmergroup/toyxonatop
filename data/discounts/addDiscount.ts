import { useMutation } from "@tanstack/vue-query";
import $authApi from "~/http/authApi";

export function useAddDiscount() {
  return useMutation({
    mutationKey: ['addDiscount'],
    mutationFn: async (payload: {
      notes: string,
      image_url: string,
      is_active: number,
      wedding_hall_id: number
    }) => {
      const response = await $authApi.post("discounts/add", payload);
      return response.data;
    },
  });
}