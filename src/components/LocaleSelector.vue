<template>
  <div class="absolute top-4 right-4">
    <select
      v-model="currentLocale"
      @change="setLocale"
      class="bg-white border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
    >
      <option value="pt-BR">Português</option>
      <option value="en-US">English</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const currentLocale = ref(localStorage.getItem('locale') || 'pt-BR');

function setLocale() {
  localStorage.setItem('locale', currentLocale.value);
  window.location.reload();
}
</script> 