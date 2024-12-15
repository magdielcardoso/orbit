<template>
  <div class="flex gap-6">
    <button 
      @click="handleLanguageChange('pt')" 
      class="flex flex-col items-center gap-1"
      :title="t('common.languages.pt')"
    >
      <div :class="['w-8 h-8 rounded-full overflow-hidden transition-all', 
              currentLocale === 'pt' ? 'scale-110' : 'hover:scale-105']">
        <img src="/assets/ui/flags/brasil.png" alt="Português" class="w-full h-full object-cover" />
      </div>
      <span class="text-xs text-gray-600" :class="{ 'font-medium': currentLocale === 'pt' }">
        {{ currentLocale === 'en' ? 'Portuguese' : 'Português' }}
      </span>
    </button>
    <button 
      @click="handleLanguageChange('en')" 
      class="flex flex-col items-center gap-1"
      :title="t('common.languages.en')"
    >
      <div :class="['w-8 h-8 rounded-full overflow-hidden transition-all', 
              currentLocale === 'en' ? 'scale-110' : 'hover:scale-105']">
        <img src="/assets/ui/flags/us.png" alt="English" class="w-full h-full object-cover" />
      </div>
      <span class="text-xs text-gray-600" :class="{ 'font-medium': currentLocale === 'en' }">
        {{ currentLocale === 'pt' ? 'Inglês' : 'English' }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from '@/i18n/plugin';

const { t, setLocale } = useI18n();
const currentLocale = ref(localStorage.getItem('locale') || 'pt');

function handleLanguageChange(locale) {
  currentLocale.value = locale;
  setLocale(locale);
  localStorage.setItem('locale', locale);
}

onMounted(() => {
  // Garante que o idioma inicial está sincronizado
  const savedLocale = localStorage.getItem('locale');
  if (savedLocale) {
    currentLocale.value = savedLocale;
    setLocale(savedLocale);
  }
});
</script> 