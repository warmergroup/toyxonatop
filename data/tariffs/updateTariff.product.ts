import { useMutation } from "@tanstack/vue-query";
import $authApi from "~/http/authApi";
import type { TariffProductFormData } from "~/interfaces";


export const useUpdateTariffProduct = (product_id: number) => {
  return useMutation({
    mutationFn: async (product: TariffProductFormData) => {
      return $authApi.put(`/tariff-products/update/${product_id}`, product);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update tariff product';
      throw new Error(errorMessage);
    }
  });
};