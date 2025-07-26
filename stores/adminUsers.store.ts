import {defineStore} from 'pinia'
import type {IUser} from '~/interfaces'

export const useAdminUsersStore = defineStore('adminUsers', {
  state: () => ({
    adminUsers: [] as IUser[],
    isLoading: true as boolean,
  }),
  getters: {
    getAdminUsers: (state) => state.adminUsers,
    getIsLoading: (state) => state.isLoading,
  },
  actions: {
    setAdminUsers(users: IUser[]) {
      this.adminUsers = users;
      this.isLoading = false;
    },
    setIsLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },
  },
})