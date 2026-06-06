import type { DocsBrand } from '@/lib/docs-brand';
import { brandText } from '@/lib/docs-brand';

type UnknownRecord = Record<string, unknown>;
type OpenAPILikeDocument = UnknownRecord & {
  servers?: unknown;
};

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) return value.map(cloneValue) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as UnknownRecord).map(([key, item]) => [
        key,
        cloneValue(item),
      ]),
    ) as T;
  }

  return value;
}

function replaceTextValues(value: unknown, brand: DocsBrand): unknown {
  if (typeof value === 'string') return brandText(value, brand);
  if (Array.isArray(value)) return value.map((item) => replaceTextValues(item, brand));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as UnknownRecord).map(([key, item]) => [
        key,
        replaceTextValues(item, brand),
      ]),
    );
  }

  return value;
}

export function brandOpenAPIDocument<T extends OpenAPILikeDocument>(
  document: T,
  brand: DocsBrand,
): T {
  const cloned = replaceTextValues(cloneValue(document), brand) as T;
  cloned.servers = [
    {
      url: brand.publicOrigin,
      description: 'The base URL of your API endpoint.',
    },
  ];
  return cloned;
}
