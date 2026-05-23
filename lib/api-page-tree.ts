import type { ReactNode } from 'react';
import type { Root } from 'fumadocs-core/page-tree';
import type { Locale } from '@/lib/i18n';

export function getApiGroupDisplayName(name: ReactNode) {
  if (typeof name !== 'string') return name;

  const displayName = name.replace(/^(?:AI|A\s+I)\s*模型\s*(?:[-－]\s*)?/, '');

  if (displayName === '图像') return '图片';

  return displayName;
}

function localizeApiUrl(url: string, locale: Locale) {
  if (locale === 'en') return url;

  return `/${locale}${url}`;
}

export function getLocalizedApiPageTree(tree: Root, locale: Locale): Root {
  return {
    ...tree,
    children: tree.children.map((node) => {
      if (node.type === 'page') {
        return {
          ...node,
          url: localizeApiUrl(node.url, locale),
        };
      }

      if (node.type === 'separator') {
        return {
          ...node,
          name: getApiGroupDisplayName(node.name),
        };
      }

      if (node.type === 'folder') {
        return {
          ...node,
          name: getApiGroupDisplayName(node.name),
          index: node.index
            ? {
                ...node.index,
                url: localizeApiUrl(node.index.url, locale),
              }
            : undefined,
          children: getLocalizedApiPageTree(
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
