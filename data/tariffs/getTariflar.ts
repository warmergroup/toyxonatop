import {useQuery} from '@tanstack/vue-query'
import $axios from '~/http'

export const useGetTariflarQuery = (wedding_hall_id: string) => {
  return useQuery({
    queryKey: ['get-tariflar', wedding_hall_id],
    queryFn: async () => {
      try {
        const {data} = await $axios.get(`tariffs/${wedding_hall_id}`);
        if (data.status && Array.isArray(data.data)) {
          return data.data; 
        }
        throw new Error(data.message || 'Tariflarni yuklashda xatolik yuz berdi');
      } catch (error) {
        throw new Error('Tariflarni yuklashda xatolik yuz berdi');
      }
    },
  });
};