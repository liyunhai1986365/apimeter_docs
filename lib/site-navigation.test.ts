import { describe, expect, it } from 'vitest';
import { baseOptions } from '@/lib/layout.shared';
import { getSiteNavigation, siteNavigation } from '@/lib/site-navigation';

describe('site navigation', () => {
  it('contains the shared local default top-level links', () => {
    expect(siteNavigation).toEqual([
      { text: '首页', url: 'http://localhost:3030/' },
      { text: '控制台', url: 'http://localhost:3030/dashboard/overview' },
      { text: '模型广场', url: 'http://localhost:3030/pricing' },
    ]);
  });

  it('can build shared links from a configured public origin', () => {
    expect(getSiteNavigation('https://tenant.example.com')).toEqual([
      { text: '首页', url: 'https://tenant.example.com/' },
      { text: '控制台', url: 'https://tenant.example.com/dashboard/overview' },
      { text: '模型广场', url: 'https://tenant.example.com/pricing' },
    ]);
  });

  it('keeps external site links out of the Fumadocs sidebar links', () => {
    expect(baseOptions('zh').links).toBeUndefined();
  });

  it('moves language and theme controls out of the Fumadocs sidebar', () => {
    expect(baseOptions('zh')).toMatchObject({
      i18n: false,
      themeSwitch: {
        enabled: false,
      },
    });
  });
});
