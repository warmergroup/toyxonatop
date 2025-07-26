import {defineStore} from 'pinia'

export const useLocationStore = defineStore('location', {
  state: () => ({
    coords: null as { latitude: number; longitude: number } | null,
    error: null as string | null,
  }),
  actions: {
    setCoords(coords: { latitude: number; longitude: number }) {
      this.coords = coords
    },
    setError(error: string) {
      this.error = error
    }
  }
})