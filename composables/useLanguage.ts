import {useI18n} from 'vue-i18n'
import {useLanguageStore} from '~/stores/language'
import {useRouter, useRoute} from 'vue-router'

type Language = 'uz' | 'ru' | 'en'

export const useLanguage = () => {
  const {setLocale} = useI18n()
  const langStore = useLanguageStore()
  const router = useRouter()
  const route = useRoute()

  const changeLanguage = async (lang: Language) => {
    try {
      
      await setLocale(lang)
      langStore.setLang(lang)
      localStorage.setItem('selectedLang', lang)
      
      const currentPath = route.fullPath
      if (currentPath.startsWith('/' + lang)) {
        return
      }

      const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${lang}`)
    
      await router.replace({
        path: newPath,
        query: route.query,
        hash: route.hash
      })

    } catch (error) {
      console.error(`Tilni o'zgartirishda xatolik:`, error)
    }
  }

  return {
    changeLanguage
  }
}