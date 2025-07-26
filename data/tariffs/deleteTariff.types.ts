import { useMutation } from '@tanstack/vue-query'
import $authApi from '~/http/authApi'

export const useDeleteTariffType = () => {
    return useMutation({
      mutationFn: async (price_id: number | string) => {
        return $authApi.delete(`/tariff-types/delete/${price_id}`)
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || 'Failed to delete prices';
        throw new Error(errorMessage);
      }
    })
  }

