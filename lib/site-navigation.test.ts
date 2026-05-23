import { describe, expect, it } from 'vitest';
import { baseOptions } from '@/lib/layout.shared';
import { siteNavigation } from '@/lib/site-navigation';

describe('site navigation', () => {
  it('contains the shared ModelSell top-level links', () => {
    expect(siteNavigation).toEqual([
      { text: '首页', url: 'https://modelsell.com/' },
      { text: '控制台', url: 'https://modelsell.com/dashboard/overview' },
      { text: '模型广场', url: 'https://modelsell.com/pricing' },
      { text: 'Agent 工具接入', url: 'https://docs.modelsell.com/' },
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
