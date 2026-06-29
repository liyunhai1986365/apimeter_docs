import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  apiReferenceMdxSlugs,
  apiReferenceMdxSlugKey,
  getApiReferenceMdxTitle,
} from './api-reference-mdx-pages';

describe('API reference MDX pages', () => {
  it('declares supplemental API reference pages under the API reference route', () => {
    expect(apiReferenceMdxSlugs).toEqual([
      ['midjourney', 'integration'],
      ['suno', 'integration'],
      ['seedance-2', 'overview'],
      ['seedance-2', 'assets'],
      ['seedance-2', 'generic-video'],
      ['seedance-2', 'modes'],
      ['seedance-2', 'python-polling'],
      ['grok', 'video-generation'],
    ]);
    expect(apiReferenceMdxSlugKey(['seedance-2', 'overview'])).toBe('seedance-2/overview');
    expect(getApiReferenceMdxTitle(['seedance-2', 'modes'], 'zh')).toBe('生成模式示例');
    expect(getApiReferenceMdxTitle(['grok', 'video-generation'], 'zh')).toBe('Grok 视频生成');
    expect(getApiReferenceMdxTitle(['midjourney', 'integration'], 'zh')).toBe('对接说明');
    expect(getApiReferenceMdxTitle(['suno', 'integration'], 'en')).toBe('Integration Guide');
  });

  it('keeps supplemental API reference page files in sync with the declared slugs', () => {
    for (const slug of apiReferenceMdxSlugs) {
      const zhContent = readFileSync(
        resolve(process.cwd(), 'content/docs/zh/api-reference', ...slug) + '.mdx',
        'utf8',
      );
      const enContent = readFileSync(
        resolve(process.cwd(), 'content/docs/en/api-reference', ...slug) + '.mdx',
        'utf8',
      );

      expect(zhContent).toContain('title:');
      expect(enContent).toContain('title:');
    }
  });

  it('documents Midjourney and Suno integration guides with runnable examples', () => {
    const midjourney = readFileSync(
      resolve(process.cwd(), 'content/docs/zh/api-reference/midjourney/integration.mdx'),
      'utf8',
    );
    const suno = readFileSync(
      resolve(process.cwd(), 'content/docs/zh/api-reference/suno/integration.mdx'),
      'utf8',
    );

    for (const snippet of [
      '/mj/submit/imagine',
      'mj-fast/mj/submit/imagine',
      '/mj/task/{task_id}/fetch',
      'botType',
      'base64Array',
      'notifyHook',
      'U/V/Reroll',
    ]) {
      expect(midjourney).toContain(snippet);
    }

    for (const snippet of [
      '/suno/submit/music',
      '/suno/fetch/{task_id}',
      'GoAmz',
      'SunoAPI',
      'chirp-v4',
      'custom_mode',
      'make_instrumental',
      'callback_url',
    ]) {
      expect(suno).toContain(snippet);
    }
  });
});
