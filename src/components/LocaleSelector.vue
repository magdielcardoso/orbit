<template>
  <div class="absolute top-4 right-4">
    <select
      v-model="currentLocale"
      @change="handleLanguageChange"
      class="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
    >
      <option value="pt">Português</option>
      <option value="en">English</option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from '@/i18n/plugin';

const { setLocale } = useI18n();
const currentLocale = ref(localStorage.getItem('locale') || 'pt');

function handleLanguageChange() {
  setLocale(currentLocale.value);
  localStorage.setItem('locale', currentLocale.value);
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