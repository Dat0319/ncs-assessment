import i18n from 'i18n';
import path from 'path';

i18n.configure({
  locales: ['en', 'vi'],
  defaultLocale: 'en',
  queryParameter: 'lang',
  directory: path.join(__dirname, './locales'),
  syncFiles: false,
  autoReload: true,
  updateFiles: false,
});

export default i18n;
