import { apiSource } from '@/lib/api-source';
import { decodeRouteSlug } from '@/lib/route-slug';

export function getApiReferencePage(slug?: string[] | string) {
  const decoded = decodeRouteSlug(slug);

  if (!decoded || decoded.length === 0) return undefined;

  const targetUrl = `/api-reference/${decoded
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`;

  return apiSource.getPages().find((page) => page.url === targetUrl);
}
