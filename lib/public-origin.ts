const defaultPublicOrigin = 'https://modelsell.com';

type EnvLike = Record<string, string | undefined>;

export function normalizePublicOrigin(origin?: string | null) {
  if (!origin) return undefined;

  try {
    const url = new URL(origin);
    return url.origin;
  } catch {
    return undefined;
  }
}

export function getConfiguredPublicOrigin(
  env: EnvLike = process.env,
) {
  return (
    normalizePublicOrigin(env.MODELSELL_PUBLIC_BASE_URL) ??
    normalizePublicOrigin(env.NEXT_PUBLIC_MODELSELL_BASE_URL) ??
    defaultPublicOrigin
  );
}

export function getPublicOriginFromHeaders(
  headers: Headers,
  requestUrl: string,
  env: EnvLike = process.env,
) {
  const forwardedHost = headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const forwardedProto = headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim();
  const host = forwardedHost || headers.get('host')?.split(',')[0]?.trim();

  if (host) {
    const proto =
      forwardedProto ||
      (host.startsWith('localhost') || host.startsWith('127.0.0.1')
        ? 'http'
        : 'https');
    const origin = normalizePublicOrigin(`${proto}://${host}`);
    if (origin) return origin;
  }

  return normalizePublicOrigin(requestUrl) ?? getConfiguredPublicOrigin(env);
}
