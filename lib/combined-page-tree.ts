import type { Root } from 'fumadocs-core/page-tree';
import { apiSource } from '@/lib/api-source';
import { source } from '@/lib/source';
import type { Locale } from '@/lib/i18n';

function localizeApiUrl(url: string, locale: Locale) {
  if (locale === 'en') return url;

  return `/${locale}${url}`;
}

function localizeApiTree(tree: Root, locale: Locale): Root {
  return {
    ...tree,
    children: tree.children.map((node) => {
      if (node.type === 'page') {
        return {
          ...node,
          url: localizeApiUrl(node.url, locale),
        };
      }

      if (node.type === 'folder') {
        return {
          ...node,
          index: node.index
            ? {
                ...node.index,
                url: localizeApiUrl(node.index.url, locale),
              }
            : undefined,
          children: localizeApiTree(
            {
              type: 'root',
              name: '',
              children: node.children,
            },
            locale,
          ).children,
        };
      }

      return node;
    }),
  };
}

export function getCombinedPageTree(locale: Locale): Root {
  const docsTree = source.getPageTree(locale);
  const apiTree = localizeApiTree(apiSource.pageTree, locale);

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
