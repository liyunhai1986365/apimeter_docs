import { isValidElement } from 'react';
import type { DocsBrand } from '@/lib/docs-brand';
import { brandText } from '@/lib/docs-brand';

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
