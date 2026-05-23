import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { defineI18nUI } from 'fumadocs-ui/i18n';
import { i18n, type Locale } from '@/lib/i18n';
import { getLocalizedHref } from '@/lib/i18n-path';

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

export function baseOptions(locale: Locale): BaseLayoutProps {
  return {
    nav: {
      title: locale === 'zh' ? 'ModelSell 文档' : 'ModelSell Docs',
    },
    links: [
      {
        text: locale === 'zh' ? '文档' : 'Docs',
        url: getLocalizedHref('/docs', locale),
        active: 'nested-url',
      },
    ],
  };
}
