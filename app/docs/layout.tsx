import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { getCombinedPageTree } from '@/lib/combined-page-tree';
import { baseOptions } from '@/lib/layout.shared';
import { defaultLocale } from '@/lib/i18n';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions(defaultLocale)}
      tree={getCombinedPageTree(defaultLocale)}
      i18n
    >
      {children}
    </DocsLayout>
  );
}
