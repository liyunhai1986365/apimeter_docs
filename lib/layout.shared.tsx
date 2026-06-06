import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import type { DocsBrand } from '@/lib/docs-brand';
import { i18n, type Locale } from '@/lib/i18n';

export const i18nUI = defineI18nUI(i18n, {
  en: {
    displayName: 'English',
    search: 'Search docs',
  },
  zh: {
    displayName: '中文',
    search: '搜索文档',
  },
});

export function baseOptions(
  locale: Locale,
  brand: DocsBrand = { name: 'ModelSell', publicOrigin: 'https://modelsell.com' },
): BaseLayoutProps {
  return {
    nav: {
      title: locale === 'zh' ? `${brand.name} 文档` : `${brand.name} Docs`,
    },
    i18n: false,
    themeSwitch: {
      enabled: false,
    },
  };
}
