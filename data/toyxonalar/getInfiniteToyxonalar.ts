import { useInfiniteQuery } from '@tanstack/vue-query';
import $axios from "~/http";
import $authApi from '~/http/authApi';

export const useInfiniteToyxonalarQuery = (
    itemsPerPage = 14,
    mode: 'public' | 'admin' = 'public'
  ) => {
  const api = mode === 'admin' ? $authApi : $axios;
  
    return useInfiniteQuery({
      queryKey: ['venues-infinite', mode],
      queryFn: async ({pageParam = 1}) => {
        try {
          const params: any = {
              page: pageParam,
              limit: itemsPerPage
            }
          const {data} = await api.get('wedding-halls/all', {
            params
          })
          if (data && Array.isArray(data.data)) {
            data.data.sort((a: { created_at: string }, b: { created_at: string }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            return data.data;
          }
          return [];
        } catch (error: any) {
          throw error;
        }
      },
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (!lastPage || lastPage.length < itemsPerPage) return undefined;
        return lastPageParam + 1;
      },
      initialPageParam: 1,
    });
  }