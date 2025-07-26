import {defineStore} from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    lang: 'uz'
  }),
  actions: {
    setLang(lang: string) {
      this.lang = lang
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('selectedLang', lang)
      }
    },
    getLang() {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedLang = localStorage.getItem('selectedLang')
        if (storedLang) {
          this.lang = storedLang
        }
      }
      return this.lang
    }
  }
}) 