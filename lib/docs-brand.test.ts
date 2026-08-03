import { describe, expect, it } from 'vitest';
import {
  brandText,
  getDocsBrandFromHeaders,
  getDocsBrandFromOrigin,
  isAgentAppsSlug,
  isOfficialDocsBrand,
} from '@/lib/docs-brand';

describe('docs brand helpers', () => {
  it('uses the current request host as the default brand', () => {
    expect(getDocsBrandFromOrigin('https://modelsell.com/docs')).toEqual({
      name: 'modelsell.com',
      publicOrigin: 'https://modelsell.com',
      apiBaseUrl: undefined,
      apiOrigin: undefined,
      apiKeyName: undefined,
    });
    expect(getDocsBrandFromOrigin('https://docs.modelsell.com')).toEqual({
      name: 'docs.modelsell.com',
      publicOrigin: 'https://docs.modelsell.com',
      apiBaseUrl: undefined,
      apiOrigin: undefined,
      apiKeyName: undefined,
    });
  });

  it('uses the local host as the default local development brand', () => {
    expect(getDocsBrandFromOrigin('http://127.0.0.1:3030/docs')).toEqual({
      name: '127.0.0.1:3030',
      publicOrigin: 'http://127.0.0.1:3030',
      apiBaseUrl: undefined,
      apiOrigin: undefined,
      apiKeyName: undefined,
    });
    expect(getDocsBrandFromOrigin('http://localhost:3030/docs')).toEqual({
      name: 'localhost:3030',
      publicOrigin: 'http://localhost:3030',
      apiBaseUrl: undefined,
      apiOrigin: undefined,
      apiKeyName: undefined,
    });
  });

  it('uses the current proxy host as the docs brand', () => {
    expect(getDocsBrandFromOrigin('https://aiiqq.com/docs')).toEqual({
      name: 'aiiqq.com',
      publicOrigin: 'https://aiiqq.com',
      apiBaseUrl: undefined,
      apiOrigin: undefined,
      apiKeyName: undefined,
    });
  });

  it('allows overriding the docs brand name from server env', () => {
    const localBrand = getDocsBrandFromOrigin('http://127.0.0.1:3030/docs', {
        DOCS_BRAND_NAME: '自定义品牌',
      });
    expect(localBrand).toEqual({
      name: '自定义品牌',
      publicOrigin: 'http://127.0.0.1:3030',
      apiBaseUrl: undefined,
      apiOrigin: undefined,
      apiKeyName: undefined,
      isConfigured: true,
    });
    expect(isOfficialDocsBrand(localBrand)).toBe(true);

    expect(
      getDocsBrandFromHeaders(
        new Headers({ host: 'modelsell.com' }),
        'https://modelsell.com/docs',
        { DOCS_BRAND_NAME: '自定义品牌' },
      ),
    ).toEqual({
      name: '自定义品牌',
      publicOrigin: 'https://modelsell.com',
      apiBaseUrl: undefined,
      apiOrigin: undefined,
      apiKeyName: undefined,
      isConfigured: true,
    });
  });

  it('allows overriding the displayed API key variable name from server env', () => {
    const brand = getDocsBrandFromOrigin('http://127.0.0.1:3030/docs', {
      DOCS_API_KEY_NAME: 'apikey',
    });

    expect(brand).toEqual({
      name: '127.0.0.1:3030',
      publicOrigin: 'http://127.0.0.1:3030',
      apiBaseUrl: undefined,
      apiOrigin: undefined,
      apiKeyName: 'apikey',
    });
    expect(
      brandText('Authorization: Bearer $MODELSELL_API_KEY', brand),
    ).toBe('Authorization: Bearer $apikey');
    expect(
      brandText('os.environ["MODELSELL_API_KEY"]', brand),
    ).toBe('os.environ["apikey"]');
  });

  it('allows overriding API base URL examples from server env', () => {
    const brand = getDocsBrandFromOrigin('http://127.0.0.1:3030/docs', {
      DOCS_API_BASE_URL: 'https://api.example.com/',
    });

    expect(brand.apiBaseUrl).toBe('https://api.example.com');
    expect(brand.apiOrigin).toBe('https://api.example.com');
    expect(brandText('curl MODELSELL_API_BASE_URL/models', brand)).toBe(
      'curl https://api.example.com/models',
    );
  });

  it('falls back API base URL examples to the configured public origin plus v1', () => {
    const brand = getDocsBrandFromOrigin('http://127.0.0.1:3030/docs', {
      DOCS_PUBLIC_BASE_URL: 'https://apimeter.net',
    });

    expect(brandText('base_url = "MODELSELL_API_BASE_URL"', brand)).toBe(
      'base_url = "https://apimeter.net/v1"',
    );
  });

  it('identifies official docs brands and agent apps slugs', () => {
    expect(
      isOfficialDocsBrand({
        name: 'ModelSell',
        publicOrigin: 'https://modelsell.com',
      }),
    ).toBe(true);
    expect(
      isOfficialDocsBrand({
        name: 'aiiqq.com',
        publicOrigin: 'https://aiiqq.com',
      }),
    ).toBe(false);
    expect(isAgentAppsSlug(['apps'])).toBe(true);
    expect(isAgentAppsSlug(['apps', 'cc-switch-setup'])).toBe(true);
    expect(isAgentAppsSlug(['api-reference'])).toBe(false);
    expect(isAgentAppsSlug()).toBe(false);
  });

  it('derives proxy brand from forwarded request headers', () => {
    const headers = new Headers({
      'x-forwarded-host': 'aiiqq.com',
      'x-forwarded-proto': 'https',
      host: '127.0.0.1:3030',
    });

    expect(getDocsBrandFromHeaders(headers, 'http://127.0.0.1:3030/docs')).toEqual({
      name: 'aiiqq.com',
      publicOrigin: 'https://aiiqq.com',
      apiBaseUrl: undefined,
      apiOrigin: undefined,
      apiKeyName: undefined,
    });
  });

  it('replaces ModelSell mentions in display text', () => {
    expect(
      brandText(
        'ModelSell 文档推荐先用 ModelSell CLI，然后在 ModelSell 控制台生成 API Key。',
        { name: 'aiiqq.com', publicOrigin: 'https://aiiqq.com' },
      ),
    ).toBe(
      'aiiqq.com 文档推荐先用 aiiqq.com CLI，然后在 aiiqq.com 控制台生成 API Key。',
    );
  });
});
