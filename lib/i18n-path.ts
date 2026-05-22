import { defaultLocale, i18n, type Locale } from '@/lib/i18n';

export function getLocaleFromParams(lang: string | undefined): Locale {
  if (i18n.languages.includes(lang as Locale)) return lang as Locale;

  return defaultLocale;
}

export function getLocalizedHref(href: string, locale: Locale): string {
  const url = new URL(href, 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);

  if (parts[0] && i18n.languages.includes(parts[0] as Locale)) {
    return `${url.pathname}${url.search}${url.hash}`;
  }

  if (locale === defaultLocale) return `${url.pathname}${url.search}${url.hash}`;

  return `/${locale}${url.pathname}${url.search}${url.hash}`;
}

export function switchLocalePath(pathname: string, locale: Locale): string {
  const url = new URL(pathname, 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);

  if (parts[0] && i18n.languages.includes(parts[0] as Locale)) {
    parts.shift();
  }

  const path = `/${parts.join('/')}`;
  const localizedPath =
    locale === defaultLocale ? path : `/${locale}${path === '/' ? '' : path}`;

  return `${localizedPath}${url.search}${url.hash}`;
}
