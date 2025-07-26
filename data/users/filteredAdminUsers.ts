import {useQuery} from "@tanstack/vue-query";
import AuhtApi from "~/http/authApi"
import type {IUser} from "~/interfaces";

export const filteredAdminUsers = () => {
  return useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const {data} = await AuhtApi.get("/users");
      return data.filter(
        (user: IUser) => user.role === 'admin' || user.role === 'superadmin'
      );
    },
  });
}