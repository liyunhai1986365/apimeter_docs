import { describe, expect, it } from 'vitest';
import { formatJsonBody, isAllowedProxyTarget } from '@/app/api/proxy/route';

describe('API playground proxy formatting', () => {
  it('pretty prints JSON responses for the playground result panel', () => {
    expect(formatJsonBody('application/json; charset=utf-8', '{"ok":true,"items":[1,2]}')).toBe(
      '{\n  "ok": true,\n  "items": [\n    1,\n    2\n  ]\n}\n',
    );
  });

  it('keeps non-JSON responses unchanged', () => {
    expect(formatJsonBody('text/plain', '{"ok":true}')).toBe('{"ok":true}');
  });

  it('keeps invalid JSON unchanged', () => {
    expect(formatJsonBody('application/json', 'not json')).toBe('not json');
  });

  it('allows playground requests to the current proxy origin', () => {
    expect(
      isAllowedProxyTarget(
        new URL('https://tenant.example.com/v1/models'),
        new Headers({
          'x-forwarded-host': 'tenant.example.com',
          'x-forwarded-proto': 'https',
        }),
        'http://127.0.0.1:3030/api/proxy',
      ),
    ).toBe(true);
  });

  it('keeps blocking playground requests to unrelated origins', () => {
    expect(
      isAllowedProxyTarget(
        new URL('https://evil.example.com/v1/models'),
        new Headers({
          'x-forwarded-host': 'tenant.example.com',
          'x-forwarded-proto': 'https',
        }),
        'http://127.0.0.1:3030/api/proxy',
      ),
    ).toBe(false);
  });
});
