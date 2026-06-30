import { apiSource } from '@/lib/api-source';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/source';
import { apiReferenceMdxSlugKey, getApiReferenceMdxSlugs } from '@/lib/api-reference-mdx-pages';
import { decodeRouteSlug } from '@/lib/route-slug';

export function getApiReferencePage(slug?: string[] | string) {
  const decoded = decodeRouteSlug(slug);

  if (!decoded || decoded.length === 0) return undefined;

  const targetUrl = `/docs/api-reference/${decoded
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`;

  return apiSource.getPages().find((page) => page.url === targetUrl);
}

export function getApiReferenceMdxPage(slug: string[] | string | undefined, locale: Locale) {
  const decoded = decodeRouteSlug(slug);
  const slugKey = apiReferenceMdxSlugKey(decoded);
  const isKnownMdxSlug = getApiReferenceMdxSlugs(locale).some(
    (mdxSlug) => apiReferenceMdxSlugKey([...mdxSlug]) === slugKey,
  );

  if (!isKnownMdxSlug) return undefined;

  return source.getPage(['api-reference', ...slugKey.split('/')], locale);
}
