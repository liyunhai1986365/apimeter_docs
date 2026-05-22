import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: ['en', 'zh'],
  hideLocale: 'default-locale',
  parser: 'dir',
});

export type Locale = (typeof i18n.languages)[number];

export const defaultLocale = i18n.defaultLanguage;
