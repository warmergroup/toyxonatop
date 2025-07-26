import { useMutation } from "@tanstack/vue-query";
import $authApi from "~/http/authApi";

interface ChangeStatusPayload {
  wedding_hall_id: number | string;
  status: string; // 'active' | 'rejected' | 'arxiv' | 'new' | 'review'
  reject_reason?: string;
}

export const useChangeToyxonaStatus = () => {
  return useMutation({
    mutationFn: async (payload: ChangeStatusPayload) => {
      return $authApi.post(`/wedding-halls/change-status`, payload);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to change toyxona status";
      throw new Error(errorMessage);
    },
  });
};