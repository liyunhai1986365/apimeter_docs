import { describe, expect, it } from 'vitest';
import {
  brandText,
  getDocsBrandFromHeaders,
  getDocsBrandFromOrigin,
  isAgentAppsSlug,
  isOfficialDocsBrand,
} from '@/lib/docs-brand';

describe('docs brand helpers', () => {
  it('keeps the canonical brand on official ModelSell origins', () => {
    expect(getDocsBrandFromOrigin('https://modelsell.com/docs')).toEqual({
      name: 'ModelSell',
      publicOrigin: 'https://modelsell.com',
    });
    expect(getDocsBrandFromOrigin('https://docs.modelsell.com')).toEqual({
      name: 'ModelSell',
      publicOrigin: 'https://docs.modelsell.com',
    });
  });

  it('uses the current proxy host as the docs brand', () => {
    expect(getDocsBrandFromOrigin('https://aiiqq.com/docs')).toEqual({
      name: 'aiiqq.com',
      publicOrigin: 'https://aiiqq.com',
    });
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
    expect(isAgentAppsSlug(['apps', 'modelsell-cli'])).toBe(true);
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
    });
  });

  it('replaces normal ModelSell mentions but preserves ModelSell CLI', () => {
    expect(
      brandText(
        'ModelSell 文档推荐先用 ModelSell CLI，然后在 ModelSell 控制台生成 API Key。',
        { name: 'aiiqq.com', publicOrigin: 'https://aiiqq.com' },
      ),
    ).toBe(
      'aiiqq.com 文档推荐先用 ModelSell CLI，然后在 aiiqq.com 控制台生成 API Key。',
    );
  });
});
