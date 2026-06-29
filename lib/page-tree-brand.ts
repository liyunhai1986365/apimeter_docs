import { isValidElement } from 'react';
import type { DocsBrand } from '@/lib/docs-brand';
import { brandText } from '@/lib/docs-brand';

function isAgentAppsItem(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const url = (value as { url?: unknown }).url;
  return typeof url === 'string' && /\/docs\/apps(?:\/|$)/.test(url);
}

function filterAgentAppsPageTree<T>(value: T): T | undefined {
  if (isValidElement(value)) return value;
  if (Array.isArray(value)) {
    return value
      .map((item) => filterAgentAppsPageTree(item))
      .filter((item) => item !== undefined) as T;
  }
  if (isAgentAppsItem(value)) return undefined;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, item]) => {
        const filtered = filterAgentAppsPageTree(item);
        return filtered === undefined ? [] : [[key, filtered]];
      }),
    ) as T;
  }

  return value;
}

export function brandPageTree<T>(value: T, brand: DocsBrand): T {
  if (brand.name === 'ModelSell') return value;
  if (typeof value === 'string') return brandText(value, brand) as T;
  if (Array.isArray(value)) return value.map((item) => brandPageTree(item, brand)) as T;
  if (isValidElement(value)) return value;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        brandPageTree(item, brand),
      ]),
    ) as T;
  }

  return value;
}

export function getBrandedPageTree<T>(value: T, brand: DocsBrand): T {
  const tree =
    brand.name === 'ModelSell' ? value : (filterAgentAppsPageTree(value) as T);
  return brandPageTree(tree, brand);
}
