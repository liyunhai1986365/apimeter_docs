import { describe, expect, it } from 'vitest';
import {
  getLocalizedHref,
  getLocaleFromParams,
  switchLocalePath,
} from './i18n-path';

describe('i18n path helpers', () => {
  it('keeps default English links unprefixed', () => {
    expect(getLocalizedHref('/docs/api-reference', 'en')).toBe(
      '/docs/api-reference',
    );
  });

  it('prefixes Chinese links with zh', () => {
    expect(getLocalizedHref('/docs/api-reference', 'zh')).toBe(
      '/zh/docs/api-reference',
    );
  });

  it('does not duplicate an existing locale prefix', () => {
    expect(getLocalizedHref('/zh/docs/api-reference', 'zh')).toBe(
      '/zh/docs/api-reference',
    );
  });

  it('reads supported locales from route params', () => {
    expect(getLocaleFromParams('zh')).toBe('zh');
    expect(getLocaleFromParams(undefined)).toBe('en');
    expect(getLocaleFromParams('fr')).toBe('en');
  });

  it('switches localized paths without keeping the default locale prefix', () => {
    expect(switchLocalePath('/zh/docs/api-reference', 'en')).toBe(
      '/docs/api-reference',
    );
    expect(switchLocalePath('/docs/api-reference', 'zh')).toBe(
      '/zh/docs/api-reference',
    );
  });
});
