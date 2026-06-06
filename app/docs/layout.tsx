import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { SiteHeader } from '@/components/site-header';
import { getCombinedPageTree } from '@/lib/combined-page-tree';
import { baseOptions } from '@/lib/layout.shared';
import { defaultLocale } from '@/lib/i18n';
import { getPublicOriginFromHeaders } from '@/lib/public-origin';

export default async function Layout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const publicOrigin = getPublicOriginFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'modelsell.com'}/docs`,
  );

  return (
    <>
      <SiteHeader publicOrigin={publicOrigin} />
      <DocsLayout
        {...baseOptions(defaultLocale)}
        tree={getCombinedPageTree(defaultLocale)}
      >
        {children}
      </DocsLayout>
    </>
  );
}
