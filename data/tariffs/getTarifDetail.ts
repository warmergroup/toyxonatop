import $axios from '~/http';
import {useQuery} from '@tanstack/vue-query'

export const useGetTarifDetailQuery = (tarifId: string) => {
  return useQuery({
    queryKey: ['tarif-detail', tarifId],
    queryFn: async () => {
      const {data} = await $axios(`/tariffs/show/${tarifId}`)
      return data
    }
  })
}