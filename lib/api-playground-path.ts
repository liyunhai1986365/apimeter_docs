const API_REFERENCE_PREFIX = '/api-reference';

export function getApiPlaygroundSlugs(href: string): string[] | null {
  const url = new URL(href, 'http://localhost');
  const pathname = url.pathname.replace(/\/+$/, '');

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
