import { describe, expect, it } from 'vitest';
import {
  getLocalizedHref,
  getLocaleFromParams,
  switchLocalePath,
} from './i18n-path';

describe('i18n path helpers', () => {
  it('keeps default English links unprefixed', () => {
    expect(getLocalizedHref('/docs/quickstart', 'en')).toBe('/docs/quickstart');
  });

  it('prefixes Chinese links with zh', () => {
    expect(getLocalizedHref('/docs/quickstart', 'zh')).toBe('/zh/docs/quickstart');
  });

  it('does not duplicate an existing locale prefix', () => {
    expect(getLocalizedHref('/zh/docs/quickstart', 'zh')).toBe(
      '/zh/docs/quickstart',
    );
  });

  it('reads supported locales from route params', () => {
    expect(getLocaleFromParams('zh')).toBe('zh');
    expect(getLocaleFromParams(undefined)).toBe('en');
    expect(getLocaleFromParams('fr')).toBe('en');
  });

  it('switches localized paths without keeping the default locale prefix', () => {
    expect(switchLocalePath('/zh/docs/quickstart', 'en')).toBe('/docs/quickstart');
    expect(switchLocalePath('/docs/quickstart', 'zh')).toBe('/zh/docs/quickstart');
  });
});
