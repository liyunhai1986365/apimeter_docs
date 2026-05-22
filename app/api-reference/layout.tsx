import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { apiSource } from '@/lib/api-source';
import { defaultLocale } from '@/lib/i18n';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions(defaultLocale)}
      tree={apiSource.pageTree}
      i18n
    >
      {children}
    </DocsLayout>
  );
}
