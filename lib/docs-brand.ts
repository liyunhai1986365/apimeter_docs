import {
  getExplicitConfiguredPublicOrigin,
  getConfiguredPublicOrigin,
  getPublicOriginFromHeaders,
  normalizePublicOrigin,
} from '@/lib/public-origin';

const officialHosts = new Set([
  '127.0.0.1:3030',
  'localhost:3030',
  'modelsell.com',
  'www.modelsell.com',
  'docs.modelsell.com',
]);

export type DocsBrand = {
  name: string;
  publicOrigin: string;
  apiBaseUrl?: string;
  apiOrigin?: string;
  apiKeyName?: string;
  isConfigured?: boolean;
};

type EnvLike = Record<string, string | undefined>;

function getConfiguredBrandName(env: EnvLike = process.env) {
  return (
    env.DOCS_BRAND_NAME?.trim() ||
    env.MODELSELL_DOCS_BRAND_NAME?.trim() ||
    undefined
  );
}

function getConfiguredApiKeyName(env: EnvLike = process.env) {
  return (
    env.DOCS_API_KEY_NAME?.trim() ||
    env.MODELSELL_DOCS_API_KEY_NAME?.trim() ||
    undefined
  );
}

function getConfiguredApiBaseUrl(env: EnvLike = process.env) {
  const value =
    env.DOCS_API_BASE_URL?.trim() ||
    env.MODELSELL_DOCS_API_BASE_URL?.trim() ||
    undefined;
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.toString().replace(/\/$/, '');
  } catch {
    return undefined;
  }
}

export function isOfficialDocsBrand(brand: DocsBrand): boolean {
  return (
    brand.isConfigured === true ||
    officialHosts.has(new URL(brand.publicOrigin).host.toLowerCase())
  );
}

export function isAgentAppsSlug(slug?: string[] | string): boolean {
  const parts = Array.isArray(slug) ? slug : slug ? [slug] : [];
  return parts[0] === 'apps';
}

export function getDocsBrandFromOrigin(
  origin?: string | null,
  env: EnvLike = process.env,
): DocsBrand {
  const configuredPublicOrigin = getExplicitConfiguredPublicOrigin(env);
  const publicOrigin =
    configuredPublicOrigin ??
    normalizePublicOrigin(origin) ??
    getConfiguredPublicOrigin(env);
  const host = new URL(publicOrigin).host;
  const configuredBrandName = getConfiguredBrandName(env);
  const apiBaseUrl = getConfiguredApiBaseUrl(env);

  const brand: DocsBrand = {
    name: configuredBrandName ?? host,
    publicOrigin,
    apiBaseUrl,
    apiOrigin: apiBaseUrl ? new URL(apiBaseUrl).origin : undefined,
    apiKeyName: getConfiguredApiKeyName(env),
  };
  if (configuredBrandName || configuredPublicOrigin) brand.isConfigured = true;
  return brand;
}

export function getDocsBrandFromHeaders(
  headers: Headers,
  requestUrl: string,
  env: EnvLike = process.env,
): DocsBrand {
  return getDocsBrandFromOrigin(
    getPublicOriginFromHeaders(headers, requestUrl),
    env,
  );
}

export function brandText(text: string, brand: DocsBrand) {
  const apiBaseUrl =
    brand.apiBaseUrl ??
    new URL('/v1', brand.publicOrigin).toString().replace(/\/$/, '');
  const apiOrigin = brand.apiOrigin ?? new URL(apiBaseUrl).origin;
  const withRuntimeValues = text
    .replace(/MODELSELL_API_BASE_URL/g, apiBaseUrl)
    .replace(/MODELSELL_API_ORIGIN/g, apiOrigin)
    .replace(/MODELSELL_PUBLIC_BASE_URL/g, brand.publicOrigin)
    .replace(/https:\/\/api\.modelsell\.com\/v1/g, apiBaseUrl)
    .replace(/https:\/\/modelsell\.com\/v1/g, apiBaseUrl)
    .replace(/https:\/\/api\.modelsell\.com/g, apiBaseUrl)
    .replace(/https:\/\/modelsell\.com/g, brand.publicOrigin);
  const withApiKeyName = brand.apiKeyName
    ? withRuntimeValues.replace(/MODELSELL_API_KEY/g, brand.apiKeyName)
    : withRuntimeValues;

  return withApiKeyName.replace(/ModelSell/g, brand.name);
}
