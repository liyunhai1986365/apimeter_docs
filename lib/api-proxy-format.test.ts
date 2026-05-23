import { describe, expect, it } from 'vitest';
import { formatJsonBody } from '@/app/api/proxy/route';

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
});
