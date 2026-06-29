import {
  getConfiguredPublicOrigin,
  getPublicOriginFromHeaders,
  normalizePublicOrigin,
} from '@/lib/public-origin';

const officialHosts = new Set([
  'modelsell.com',
  'www.modelsell.com',
  'docs.modelsell.com',
]);

export type DocsBrand = {
  name: string;
  publicOrigin: string;
};

export function isOfficialDocsBrand(brand: DocsBrand): boolean {
  return brand.name === 'ModelSell';
}

export function isAgentAppsSlug(slug?: string[] | string): boolean {
  const parts = Array.isArray(slug) ? slug : slug ? [slug] : [];
  return parts[0] === 'apps';
}

export function getDocsBrandFromOrigin(origin?: string | null): DocsBrand {
  const publicOrigin = normalizePublicOrigin(origin) ?? getConfiguredPublicOrigin();
  const host = new URL(publicOrigin).host;

  return {
    name: officialHosts.has(host.toLowerCase()) ? 'ModelSell' : host,
    publicOrigin,
  };
}

export function getDocsBrandFromHeaders(
  headers: Headers,
  requestUrl: string,
): DocsBrand {
  return getDocsBrandFromOrigin(
    getPublicOriginFromHeaders(headers, requestUrl),
  );
}

export function brandText(text: string, brand: DocsBrand) {
  if (brand.name === 'ModelSell') return text;

  return text.replace(/ModelSell(?! CLI)/g, brand.name);
}
