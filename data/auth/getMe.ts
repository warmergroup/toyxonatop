import $authApi from '~/http/authApi';
import {useQuery} from "@tanstack/vue-query";
import type {IUser} from '~/interfaces';

export const useGetMeQuery = () => {
  const authStore = useAuthStore();
  return useQuery({
    queryKey: ['get-me'],
    queryFn: async () => {
      authStore.setIsLoading(true);
      try {
        const { data } = await $authApi.get<IUser>('users/me');
        authStore.setUser(data);
        return data;
      } catch (e) {
        authStore.setUser(null);
        return null;
      } finally {
        authStore.setIsLoading(false);
      }
    },
    refetchOnMount: false, 
    refetchOnWindowFocus: false,

  });
};