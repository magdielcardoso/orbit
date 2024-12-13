import { createI18n } from 'vue-i18n';
import ptBR from './pt-BR';
import enUS from './en-US';

export const LOCALES = [
  { code: 'pt-BR', name: 'Português' },
  { code: 'en-US', name: 'English' }
];

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'pt-BR',
  fallbackLocale: 'pt-BR',
  messages: {
    'pt-BR': ptBR,
    'en-US': enUS
  }
}); 