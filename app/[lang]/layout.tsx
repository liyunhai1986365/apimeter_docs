import type { ReactNode } from 'react';
import { LocalizedRootProvider } from '@/components/localized-root-provider';
import { i18nUI } from '@/lib/layout.shared';
import { getLocaleFromParams } from '@/lib/i18n-path';

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const locale = getLocaleFromParams((await params).lang);

  return (
    <LocalizedRootProvider i18n={{ ...i18nUI.provider(locale), locale }}>
      {children}
    </LocalizedRootProvider>
  );
}
