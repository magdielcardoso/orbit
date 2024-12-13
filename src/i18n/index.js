import { createI18n } from 'vue-i18n';
import ptBR from './pt-BR';
import enUS from './en-US';

export const LOCALES = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' }
];

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'pt',
  fallbackLocale: 'pt',
  messages: {
    'pt': ptBR,
    'en': enUS
  }
}); 