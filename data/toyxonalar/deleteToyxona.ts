import { useMutation } from '@tanstack/vue-query'
import $authApi from '~/http/authApi'

export const useDeleteToyxona = () => {
  return useMutation({
    mutationFn: async (toyxona_Id: number | string) => {
      return $authApi.delete(`/wedding-halls/delete/${toyxona_Id}`)
      },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete toyxona';
      throw new Error(errorMessage);
    }
  })
}

