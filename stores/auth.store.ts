import { defineStore } from 'pinia';
import type { IUser, Role } from '~/interfaces';
import { setAuthToken } from '~/utils/auth';


export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as IUser | null,
        isAuth: false,
        isLoading: true as boolean,
    }),

    getters: {
        hasRole: (state) => (role: Role) => {
            return state.user?.role === role;
        },
        isAdmin(): boolean {
            return this.hasRole('admin');
        },
        isSuperAdmin(): boolean {
            return this.hasRole('superadmin');
        },
        isUser(): boolean {
            return this.hasRole('user');
        }
        
    },

    actions: {
        setUser(user: IUser | null) {
            this.user = user ? { ...user } : null;
            this.isAuth = !!user;
            this.isLoading = false;
        },
        setIsAuth(isAuth: boolean) {
            this.isAuth = isAuth;
        },
        setIsLoading(isLoading: boolean) {
            this.isLoading = isLoading;
        },
        updateUser(user: IUser | null) {
            this.user = user ? { ...user } : null;
            this.isAuth = !!user;
        },
        setToken(token: string) {
            setAuthToken(token);
        },
    
        logout() {
            this.user = null;
            this.isAuth = false;
            this.isLoading = false;
        }
    }
});