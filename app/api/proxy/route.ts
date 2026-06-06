export const runtime = 'nodejs';
export const revalidate = false;

import {
  getConfiguredPublicOrigin,
  getPublicOriginFromHeaders,
} from '@/lib/public-origin';

const hopByHopHeaders = new Set([
  'accept-encoding',
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'origin',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);
const decodedBodyHeaders = new Set([
  'content-encoding',
  'content-length',
  'transfer-encoding',
]);

function isJsonContent(contentType: string | null) {
  if (!contentType) return false;

  const mimeType = contentType.split(';', 1)[0]?.trim().toLowerCase();
  return mimeType === 'application/json' || mimeType.endsWith('+json');
}

export function formatJsonBody(contentType: string | null, body: string) {
  if (!isJsonContent(contentType)) return body;

  try {
    return `${JSON.stringify(JSON.parse(body), null, 2)}\n`;
  } catch {
    return body;
  }
}

export function isAllowedProxyTarget(
  targetUrl: URL,
  headers: Headers,
  requestUrl: string,
) {
  const allowedOrigins = new Set([
    getConfiguredPublicOrigin(),
    getPublicOriginFromHeaders(headers, requestUrl),
  ]);

  return allowedOrigins.has(targetUrl.origin);
}

async function handle(request: Request) {
  const requestUrl = new URL(request.url);
  const rawTarget = requestUrl.searchParams.get('url');

  if (!rawTarget) {
    return Response.json('[Proxy] A `url` query parameter is required for proxy url', {
      status: 400,
    });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawTarget);
  } catch {
    return Response.json('[Proxy] Invalid `url` parameter value.', {
      status: 400,
    });
  }

  if (!isAllowedProxyTarget(targetUrl, request.headers, request.url)) {
    return Response.json(
      `[Proxy] The origin "${targetUrl.origin}" is not allowed.`,
      { status: 400 },
    );
  }

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (hopByHopHeaders.has(lowerKey)) return;
    if (lowerKey.startsWith('x-forwarded-')) return;

    headers.set(key, value);
  });

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD'
        ? undefined
        : await request.arrayBuffer(),
      cache: 'no-store',
    });

    const responseHeaders = new Headers(response.headers);
    const contentType = responseHeaders.get('content-type');
    responseHeaders.forEach((_value, key) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.startsWith('access-control-') ||
        decodedBodyHeaders.has(lowerKey)
      ) {
        responseHeaders.delete(key);
      }
    });
    responseHeaders.set('X-Forwarded-Host', response.url);

    let body: BodyInit | null = response.body;
    if (isJsonContent(contentType)) {
      const text = await response.text();
      body = formatJsonBody(contentType, text);
      responseHeaders.set('content-type', contentType ?? 'application/json');
    }

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    return Response.json(
      `[Proxy] Failed to proxy request: ${
        error instanceof Error ? error.message : 'unknown reason'
      }`,
      { status: 500 },
    );
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const HEAD = handle;
