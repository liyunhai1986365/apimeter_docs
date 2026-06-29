import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { SiteHeader } from '@/components/site-header';
import { getCombinedPageTree } from '@/lib/combined-page-tree';
import { baseOptions } from '@/lib/layout.shared';
import { getLocaleFromParams } from '@/lib/i18n-path';
import { getDocsBrandFromHeaders } from '@/lib/docs-brand';
import { getBrandedPageTree } from '@/lib/page-tree-brand';

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const locale = getLocaleFromParams((await params).lang);
  const requestHeaders = await headers();
  const brand = getDocsBrandFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'modelsell.com'}/${locale}/docs`,
  );

  return (
    <>
      <SiteHeader publicOrigin={brand.publicOrigin} />
      <DocsLayout
        {...baseOptions(locale, brand)}
        tree={getBrandedPageTree(getCombinedPageTree(locale), brand)}
      >
        {children}
      </DocsLayout>
    </>
  );
}
