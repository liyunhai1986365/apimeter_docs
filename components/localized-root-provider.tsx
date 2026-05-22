'use client';

import type { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { I18nProviderProps } from 'fumadocs-ui/contexts/i18n';
import { switchLocalePath } from '@/lib/i18n-path';
import type { Locale } from '@/lib/i18n';

type LocalizedRootProviderProps = {
  children: ReactNode;
  i18n: Omit<I18nProviderProps, 'children'> & {
    locale: Locale;
  };
};

export function LocalizedRootProvider({
  children,
  i18n,
}: LocalizedRootProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <RootProvider
      i18n={{
        ...i18n,
        onLocaleChange(locale) {
          router.push(switchLocalePath(pathname, locale as Locale));
        },
      }}
    >
      {children}
    </RootProvider>
  );
}
