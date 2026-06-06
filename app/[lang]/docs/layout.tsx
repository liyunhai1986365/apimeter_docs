import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { SiteHeader } from '@/components/site-header';
import { getCombinedPageTree } from '@/lib/combined-page-tree';
import { baseOptions } from '@/lib/layout.shared';
import { getLocaleFromParams } from '@/lib/i18n-path';
import { getPublicOriginFromHeaders } from '@/lib/public-origin';

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const locale = getLocaleFromParams((await params).lang);
  const requestHeaders = await headers();
  const publicOrigin = getPublicOriginFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'modelsell.com'}/${locale}/docs`,
  );

  return (
    <>
      <SiteHeader publicOrigin={publicOrigin} />
      <DocsLayout
        {...baseOptions(locale)}
        tree={getCombinedPageTree(locale)}
      >
        {children}
      </DocsLayout>
    </>
  );
}
