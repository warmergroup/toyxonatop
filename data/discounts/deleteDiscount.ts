import { useMutation } from '@tanstack/vue-query'
import $authApi from '~/http/authApi'

export const useDeleteDiscount = () => {
  return useMutation({
    mutationKey: ['delete-discount'],
    mutationFn: async (id: number | string) => {
      try {
        const response = await $authApi.delete(`discounts/destroy/${id}`)
        return response.data
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Chegirmani o'chirishda xatolik yuz berdi"
        throw new Error(errorMessage)
      }
    }
  })
}
