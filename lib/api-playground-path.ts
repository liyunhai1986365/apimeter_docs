const API_REFERENCE_PREFIX = '/api-reference';
const SUPPORTED_LOCALE_PREFIXES = new Set(['zh']);

export function getApiPlaygroundSlugs(href: string): string[] | null {
  const url = new URL(href, 'http://localhost');
  const parts = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean);

  if (parts[0] && SUPPORTED_LOCALE_PREFIXES.has(parts[0])) {
    parts.shift();
  }

  const pathname = `/${parts.join('/')}`;

  if (
    pathname !== API_REFERENCE_PREFIX &&
    !pathname.startsWith(`${API_REFERENCE_PREFIX}/`)
  ) {
    return null;
  }

  const slugPath = pathname.slice(API_REFERENCE_PREFIX.length).replace(/^\/+/, '');

  if (!slugPath) return [];

  return slugPath.split('/').filter(Boolean).map(decodeURIComponent);
}
