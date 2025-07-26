import {useQuery} from '@tanstack/vue-query';
import $axios from '~/http'

export const getToyxonaById = (id: string) => {
  return useQuery({
    queryKey: ['toyxona', id],
    queryFn: async () => {
      try {
        const {data} = await $axios.get(`/wedding-halls/show/${id}`);
        if (data.status && data) return data;
        throw new Error(data.message || 'Toyxona topilmadi');
      } catch (error: any) {
        throw new Error('Toyxona topilmadi', error);
      }
    },
  });
}
