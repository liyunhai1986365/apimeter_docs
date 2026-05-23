import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { SiteHeader } from '@/components/site-header';
import { getCombinedPageTree } from '@/lib/combined-page-tree';
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
    <>
      <SiteHeader />
      <DocsLayout
        {...baseOptions(locale)}
        tree={getCombinedPageTree(locale)}
      >
        {children}
      </DocsLayout>
    </>
  );
}
