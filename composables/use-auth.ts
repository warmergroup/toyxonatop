import {defineStore} from "pinia";
import type {AuthType} from "~/interfaces";

export const useAuthType = defineStore("authType", {
  state: () => ({
    authType: "login" as AuthType,
  }),
  actions: {
    setAuthType(authType: AuthType) {
      this.authType = authType;
    },
  },
});