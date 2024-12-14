import { createI18n } from './plugin';
import ptCommon from './locales/pt/common';
import ptViews from './locales/pt/views';
import enCommon from './locales/en/common';
import enViews from './locales/en/views';

export const LOCALES = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' }
];

// Mescla os arquivos de tradução
const messages = {
  pt: {
    ...ptCommon,
    ...ptViews
  },
  en: {
    ...enCommon,
    ...enViews
  }
};

export const i18n = createI18n();

export { useI18n } from './plugin'; 