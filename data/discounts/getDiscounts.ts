// api/getDiscounts.ts
import {useQuery} from '@tanstack/vue-query'
import  $authApi  from '~/http/authApi';
import $axios from '~/http';

export const getDiscounts = (mode: 'public' | 'admin' = 'public') => {
  const api = mode === 'admin' ? $authApi : $axios;
  const url = mode === 'admin' ? '/discounts/all' : '/discounts';
  return useQuery({
    queryKey: ['banners', mode],
    queryFn: async () => {
      const {data} = await api.get(url)
      return data
    },
  })
}