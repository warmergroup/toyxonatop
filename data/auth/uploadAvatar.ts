import  $authApi  from '~/http/authApi';
import { useMutation } from "@tanstack/vue-query";

export const useUploadAvatar = () => {
  return useMutation({
    mutationKey: ['upload-avatar'],
    mutationFn: async (avatar:string) => {  
      try {
        const response = await $authApi.post('users/upload-avatar', {avatar});
        return response.data;
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'avatar upload filed';
        throw new Error(errorMessage);
      }
    }
  });
};