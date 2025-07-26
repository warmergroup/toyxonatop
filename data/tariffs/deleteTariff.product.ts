import { useMutation } from '@tanstack/vue-query'
import $authApi from '~/http/authApi'


export const useDeleteTariffProduct = () => {
  return useMutation({
    mutationFn: async (product_Id: number | string) => {
      return $authApi.delete(`/tariff-products/delete/${product_Id}`)
      },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete tariff product';
      throw new Error(errorMessage);
    }
  })
}