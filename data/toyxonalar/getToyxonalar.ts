import {useQuery} from '@tanstack/vue-query';
import $axios from "~/http";

export const useGetToyxonalarQuery = (currentPage: number, itemsPerpage: number, price: boolean) => {
  
  return useQuery({
    queryKey: ['get-toyxonalar', currentPage],
    queryFn: async () => {
      try {
        const {data} = await $axios.get('wedding-halls/all', {
          params: {
            limit: itemsPerpage,
            price: price,
            serarch: '',
          }
        });
      
        return data.data;
      } catch (error: any) {
        throw new Error('To\'yxonalarni yuklashda xatolik yuz berdi', error);
      }
    },
  });
};