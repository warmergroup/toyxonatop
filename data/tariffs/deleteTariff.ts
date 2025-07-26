import { useMutation } from '@tanstack/vue-query'
import $authApi from '~/http/authApi'

export const useDeleteTariff = () => {
  return useMutation({
    mutationFn: async (tariff_Id: number | string) => {
      return $authApi.delete(`/tariffs/delete/${tariff_Id}`)
      },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete tariff';
      throw new Error(errorMessage);
    }
  })
}

