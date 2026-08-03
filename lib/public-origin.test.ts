import { describe, expect, it } from 'vitest';
import {
  getConfiguredPublicOrigin,
  getExplicitConfiguredPublicOrigin,
  getPublicOriginFromHeaders,
  normalizePublicOrigin,
} from '@/lib/public-origin';

describe('public origin helpers', () => {
  it('normalizes configured origins and removes trailing slashes', () => {
    expect(normalizePublicOrigin('https://proxy.modelsell.test///')).toBe(
      'https://proxy.modelsell.test',
    );
  });

  it('accepts bare domains in configured origins', () => {
    expect(normalizePublicOrigin(' apimeter.net ')).toBe('https://apimeter.net');
    expect(normalizePublicOrigin('localhost:3030')).toBe('http://localhost:3030');
  });

  it('falls back to the local docs origin when no config is set', () => {
    expect(getConfiguredPublicOrigin({})).toBe('http://localhost:3030');
  });

  it('reads the configured public origin from server env', () => {
    expect(
      getConfiguredPublicOrigin({
        DOCS_PUBLIC_BASE_URL: 'https://tenant.example.com/',
      }),
    ).toBe('https://tenant.example.com');
    expect(
      getExplicitConfiguredPublicOrigin({
        DOCS_PUBLIC_BASE_URL: 'tenant.example.com',
      }),
    ).toBe('https://tenant.example.com');
  });

  it('derives the public origin from forwarded proxy headers', () => {
    const headers = new Headers({
      'x-forwarded-host': 'tenant.example.com',
      'x-forwarded-proto': 'https',
      host: '127.0.0.1:3030',
    });

    expect(getPublicOriginFromHeaders(headers, 'http://127.0.0.1:3030/docs')).toBe(
      'https://tenant.example.com',
    );
  });

  it('uses the request URL origin when forwarded headers are absent', () => {
    expect(
      getPublicOriginFromHeaders(new Headers(), 'https://docs.example.com/docs'),
    ).toBe('https://docs.example.com');
  });
});
