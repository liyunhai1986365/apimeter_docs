import type { Root } from 'fumadocs-core/page-tree';
import { apiSource } from '@/lib/api-source';
import { source } from '@/lib/source';
import type { Locale } from '@/lib/i18n';
import { getLocalizedApiPageTree } from '@/lib/api-page-tree';

export function getCombinedPageTree(locale: Locale): Root {
  const docsTree = source.getPageTree(locale);
  const apiTree = getLocalizedApiPageTree(apiSource.pageTree, locale);

  return {
    ...docsTree,
    children: docsTree.children.concat([
      {
        type: 'separator',
        name: locale === 'zh' ? 'API 参考' : 'API Reference',
      },
      ...apiTree.children,
    ]),
  };
}
