import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { apiSource } from '@/lib/api-source';
import { baseOptions } from '@/lib/layout.shared';
import { getLocaleFromParams } from '@/lib/i18n-path';

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const locale = getLocaleFromParams((await params).lang);

  return (
    <DocsLayout {...baseOptions(locale)} tree={apiSource.pageTree} i18n>
      {children}
    </DocsLayout>
  );
}
