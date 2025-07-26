<script setup lang="ts">
import { useLanguageStore } from '~/stores/language';
import { openState } from '~/stores/isOpen.store';

const { t } = useI18n();
const langStore = useLanguageStore();
const drawerState = openState();
const { changeLanguage } = useLanguage();

type LanguageCode = 'uz' | 'ru' | 'en';

interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'uz', name: "O'zbekcha", flag: 'custom:uz-flag' },
  { code: 'ru', name: "Русский", flag: 'custom:ru-flag' },
  { code: 'en', name: "English", flag: 'custom:en-flag' }
];

// Joriy tanlangan tilni saqlash uchun
const selectedLang = ref<LanguageCode>(langStore.lang as LanguageCode);

// Til tanlash
function selectLanguage(code: LanguageCode) {
  selectedLang.value = code;
}

// Saqlash tugmasi bosilganda
async function handleSave() {
  try {
    await changeLanguage(selectedLang.value);
    drawerState.onClose();
  } catch (error) {
    console.error('Tilni o\'zgartirishda xatolik:', error);
  }
}
</script>

<template>
  <div class="space-y-4 flex flex-col">
    <!-- Tillar ro'yxati -->
    <div v-for="lang in languages" :key="lang.code"
      class="flex items-center gap-4 p-4 rounded-lg bg-[var(--secondary-background-color)] cursor-pointer"
      @click="selectLanguage(lang.code)">
      <Icon :name="lang.flag" size="24px" />
      <div class="flex-1">
        <p class="text-base font-medium">{{ lang.name }}</p>
      </div>
      <div v-if="selectedLang === lang.code"
        class="w-6 h-6 rounded-full border-2 border-[var(--primary-color)] flex bg-white items-center justify-center">
        <div class="w-3 h-3 bg-[var(--primary-color)] rounded-full" />
      </div>
      <div v-else class="w-6 h-6 rounded-full border bg-white" />
    </div>

    <!-- Saqlash tugmasi -->
    <UiMainButton :label="t('common.save')" @click="handleSave" />
  </div>
</template>
