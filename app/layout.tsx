import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { LocalizedRootProvider } from '@/components/localized-root-provider';
import { i18nUI } from '@/lib/layout.shared';
import { defaultLocale } from '@/lib/i18n';
import './global.css';

export const metadata: Metadata = {
  title: 'Developer Docs',
  description: 'Developer documentation and API playground.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <LocalizedRootProvider
          i18n={{ ...i18nUI.provider(defaultLocale), locale: defaultLocale }}
        >
          {children}
        </LocalizedRootProvider>
      </body>
    </html>
  );
}
