const API_REFERENCE_PREFIXES = ['/docs/api-reference', '/api-reference'];
const SUPPORTED_LOCALE_PREFIXES = new Set(['zh']);

export function getApiPlaygroundSlugs(href: string): string[] | null {
  const url = new URL(href, 'http://localhost');
  const parts = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean);

  if (parts[0] && SUPPORTED_LOCALE_PREFIXES.has(parts[0])) {
    parts.shift();
  }

  const pathname = `/${parts.join('/')}`;

  const prefix = API_REFERENCE_PREFIXES.find(
    (item) => pathname === item || pathname.startsWith(`${item}/`),
  );

  if (!prefix) {
    return null;
  }

  const slugPath = pathname.slice(prefix.length).replace(/^\/+/, '');

  if (!slugPath) return [];

  return slugPath.split('/').filter(Boolean).map(decodeURIComponent);
}
