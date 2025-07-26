import { useMutation } from "@tanstack/vue-query";
import $authApi from "~/http/authApi";

export function useUploadImage() {
  return useMutation({
    mutationKey: ['uploadImage'],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const response = await $authApi.post("/image-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
  });
}
