import { useMutation } from '@tanstack/vue-query'
import $authApi from '~/http/authApi'
interface UpdateDiscountPayload {
  id: number | string;
  notes?: string;
  image_url?: string;
  is_active?: boolean | string;
  wedding_hall_id?: number | string;
}

export const useUpdateDiscount = () => {
  return useMutation({
    mutationKey: ['update-discount'],
    mutationFn: async (payload: UpdateDiscountPayload) => {
      try {
        const response = await $authApi.put(`discounts/update/${payload.id}`, payload)
        return response.data
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Chegirmani yangilashda xatolik yuz berdi"
        throw new Error(errorMessage)
      }
    }
  })
}
