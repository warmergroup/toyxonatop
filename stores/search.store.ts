// stores/search.store.ts
import { defineStore } from 'pinia'
export const useSearchStore = defineStore('search', {
  state: () => ({
    query: ''
  }),
  actions: {
    setQuery(val: string) {
      this.query = val
    }
  }
})