<script setup lang="ts">

import { useLanguageStore } from '~/stores/language'

type Language = {
  code: 'uz' | 'ru' | 'en'
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'uz', name: 'O\'zbek', flag: 'uz-flag' },
  { code: 'ru', name: 'Русский', flag: 'ru-flag' },
  { code: 'en', name: 'English', flag: 'en-flag' }
]

const { changeLanguage } = useLanguage()
const langStore = useLanguageStore()
const currentLang = computed(() => langStore.lang)
const isOpen = ref(false)

const handleLanguageChange = async (lang: Language['code']) => {
  await changeLanguage(lang)
  isOpen.value = false
}

const closeDropdown = () => {
  isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<template>
  <div class="relative" @click.stop>
    <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" @click="isOpen = !isOpen">
      <Icon :name="`custom:${currentLang}-flag`" class="w-6 h-6" />
    </button>

    <div v-if="isOpen"
      class="absolute right-0 mt-2 w-36 rounded-lg bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
      <button v-for="lang in languages" v-show="currentLang !== lang.code" :key="lang.code"
        class="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
        @click="handleLanguageChange(lang.code)">
        <Icon :name="`custom:${lang.flag}`" class="w-5 h-5" />
        <span>{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.dropdown-menu {
  min-width: 10px;
  margin-top: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown-item {
  padding: 0.5rem 1rem;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>