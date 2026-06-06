import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { SiteHeader } from '@/components/site-header';
import { getCombinedPageTree } from '@/lib/combined-page-tree';
import { baseOptions } from '@/lib/layout.shared';
import { defaultLocale } from '@/lib/i18n';
import { getDocsBrandFromHeaders } from '@/lib/docs-brand';
import { brandPageTree } from '@/lib/page-tree-brand';

export default async function Layout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const brand = getDocsBrandFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'modelsell.com'}/docs`,
  );

  return (
    <>
      <SiteHeader publicOrigin={brand.publicOrigin} />
      <DocsLayout
        {...baseOptions(defaultLocale, brand)}
        tree={brandPageTree(getCombinedPageTree(defaultLocale), brand)}
      >
        {children}
      </DocsLayout>
    </>
  );
}
