'use client';

import { Languages, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'fumadocs-ui/provider/base';
import { i18n, type Locale } from '@/lib/i18n';
import { getLocaleFromParams, switchLocalePath } from '@/lib/i18n-path';

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  zh: '中',
};

export function SiteHeaderControls() {
  const pathname = usePathname() ?? '/';
  const currentLocale = getLocaleFromParams(pathname.split('/').filter(Boolean)[0]);
  const { setTheme } = useTheme();

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className="inline-flex h-8 items-center rounded-md border bg-fd-background p-0.5"
        aria-label="切换语言"
      >
        <Languages className="mx-2 size-3.5 text-fd-muted-foreground" />
        {i18n.languages.map((locale) => {
          const active = locale === currentLocale;

          return (
            <Link
              key={locale}
              href={switchLocalePath(pathname, locale)}
              aria-current={active ? 'page' : undefined}
              className="inline-flex h-6 min-w-8 items-center justify-center rounded px-2 text-xs font-medium transition data-[active=true]:bg-fd-accent data-[active=true]:text-fd-foreground hover:text-fd-foreground"
              data-active={active}
            >
              {localeLabels[locale]}
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="切换主题"
        className="inline-flex size-8 items-center justify-center rounded-md border bg-fd-background text-fd-muted-foreground transition hover:bg-fd-accent hover:text-fd-foreground"
        onClick={toggleTheme}
      >
        <Sun className="hidden size-4 dark:block" />
        <Moon className="size-4 dark:hidden" />
      </button>
    </div>
  );
}
