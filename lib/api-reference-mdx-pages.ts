import type { Locale } from '@/lib/i18n';

type ApiReferenceMdxSlug = readonly [string, string];

export const seedance2ApiReferenceMdxSlugs = [
  ['seedance-2', 'overview'],
  ['seedance-2', 'assets'],
  ['seedance-2', 'generic-video'],
  ['seedance-2', 'modes'],
  ['seedance-2', 'python-polling'],
  ['grok', 'video-generation'],
] as const satisfies readonly ApiReferenceMdxSlug[];

export const omniApiReferenceMdxSlugs = [
  ['omni', 'overview'],
  ['omni', 'omni-fast'],
  ['omni', 'omni-fast-v2v'],
] as const satisfies readonly ApiReferenceMdxSlug[];

export const apiReferenceMdxSlugs = [
  ['midjourney', 'integration'],
  ['suno', 'integration'],
  ...seedance2ApiReferenceMdxSlugs,
  ...omniApiReferenceMdxSlugs,
] as const;

const zhOnlyApiReferenceMdxSlugKeys = new Set<string>(omniApiReferenceMdxSlugs.map((slug) => slug.join('/')));

const titles: Record<string, Record<Locale, string>> = {
  'midjourney/integration': {
    en: 'Integration Guide',
    zh: '对接说明',
  },
  'suno/integration': {
    en: 'Integration Guide',
    zh: '对接说明',
  },
  'seedance-2/overview': {
    en: 'Overview and Formats',
    zh: '接口概览与格式选择',
  },
  'seedance-2/assets': {
    en: 'Asset Upload and Management',
    zh: '素材上传与管理',
  },
  'seedance-2/generic-video': {
    en: 'Generic Video Format',
    zh: '通用视频格式调用',
  },
  'seedance-2/modes': {
    en: 'Generation Mode Examples',
    zh: '生成模式示例',
  },
  'seedance-2/python-polling': {
    en: 'Python Polling and Download',
    zh: 'Python 轮询与下载',
  },
  'grok/video-generation': {
    en: 'Grok Video Generation',
    zh: 'Grok 视频生成',
  },
  'omni/overview': {
    en: 'Omni Video Model Overview',
    zh: 'Omni 视频模型概览',
  },
  'omni/omni-fast': {
    en: 'omni-fast Video Generation',
    zh: 'omni-fast 视频生成',
  },
  'omni/omni-fast-v2v': {
    en: 'omni-fast-v2v Reference Video Generation',
    zh: 'omni-fast-v2v 参考视频生成',
  },
};

export function getApiReferenceMdxSlugs(locale?: Locale) {
  if (locale === 'en') {
    return apiReferenceMdxSlugs.filter((slug) => !zhOnlyApiReferenceMdxSlugKeys.has(slug.join('/')));
  }

  return apiReferenceMdxSlugs;
}

export function apiReferenceMdxSlugKey(slug?: string[] | string) {
  const parts = Array.isArray(slug) ? slug : slug ? [slug] : [];
  return parts.map((part) => decodeURIComponent(part)).join('/');
}

export function getApiReferenceMdxTitle(slug: string[] | string | undefined, locale: Locale) {
  const title = titles[apiReferenceMdxSlugKey(slug)]?.[locale];

  return title;
}
