import type { Locale } from '@/lib/i18n';

type ApiReferenceMdxSlug = readonly [string, string];

export const imageApiReferenceMdxSlugs = [
  ['image', 'generic-image'],
  ['image', 'seedream-5'],
  ['image', 'gemini-native-image'],
] as const satisfies readonly ApiReferenceMdxSlug[];

export const seedance2ApiReferenceMdxSlugs = [
  ['seedance-2', 'overview'],
  ['seedance-2', 'assets'],
  ['seedance-2', 'generic-video'],
  ['seedance-2', 'modes'],
  ['seedance-2', 'python-polling'],
] as const satisfies readonly ApiReferenceMdxSlug[];

export const klingApiReferenceMdxSlugs = [
  ['kling', 'video-overview'],
  ['kling', 'turbo-tasks'],
  ['kling', 'text-to-video'],
  ['kling', 'image-to-video'],
  ['kling', 'omni-video'],
  ['kling', 'motion-control'],
  ['kling', 'multi-image-to-video'],
  ['kling', 'multi-elements'],
  ['kling', 'video-extension'],
  ['kling', 'lip-sync'],
  ['kling', 'avatar'],
  ['kling', 'audio-generation'],
  ['kling', 'elements-voices'],
  ['kling', 'image-recognition'],
] as const satisfies readonly ApiReferenceMdxSlug[];

export const omniApiReferenceMdxSlugs = [
  ['omni', 'overview'],
  ['omni', 'omni-fast'],
  ['omni', 'omni-fast-v2v'],
] as const satisfies readonly ApiReferenceMdxSlug[];

export const happyHorseApiReferenceMdxSlugs = [
  ['happyhorse', 'video-generation'],
] as const satisfies readonly ApiReferenceMdxSlug[];

export const mimoApiReferenceMdxSlugs = [
  ['mimo', 'speech-recognition'],
  ['mimo', 'speech-synthesis'],
] as const satisfies readonly ApiReferenceMdxSlug[];

export const apiReferenceMdxSlugs = [
  ...imageApiReferenceMdxSlugs,
  ['midjourney', 'integration'],
  ['suno', 'integration'],
  ...mimoApiReferenceMdxSlugs,
  ...seedance2ApiReferenceMdxSlugs,
  ...klingApiReferenceMdxSlugs,
  ['grok', 'video-generation'],
  ...happyHorseApiReferenceMdxSlugs,
  ...omniApiReferenceMdxSlugs,
] as const;

const zhOnlyApiReferenceMdxSlugKeys = new Set<string>(omniApiReferenceMdxSlugs.map((slug) => slug.join('/')));

const titles: Record<string, Record<Locale, string>> = {
  'image/generic-image': {
    en: 'Generic Image Generation',
    zh: '通用图片生成',
  },
  'image/gemini-native-image': {
    en: 'Gemini Native Image Generation',
    zh: 'Gemini 原生图像生成',
  },
  'image/seedream-5': {
    en: 'Seedream 5.0 Image Generation',
    zh: 'Seedream 5.0 图片生成',
  },
  'midjourney/integration': {
    en: 'Integration Guide',
    zh: '对接说明',
  },
  'suno/integration': {
    en: 'Integration Guide',
    zh: '对接说明',
  },
  'mimo/speech-recognition': {
    en: 'MiMo Speech Recognition',
    zh: 'MiMo 语音识别',
  },
  'mimo/speech-synthesis': {
    en: 'MiMo Speech Synthesis',
    zh: 'MiMo 语音合成',
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
  'kling/video-overview': {
    en: 'Kling Video API Overview',
    zh: '可灵视频接口概览',
  },
  'kling/turbo-tasks': {
    en: 'Kling 3.0 Turbo Tasks',
    zh: 'Kling 3.0 Turbo 任务接口',
  },
  'kling/text-to-video': {
    en: 'Text to Video',
    zh: '文生视频',
  },
  'kling/image-to-video': {
    en: 'Image to Video',
    zh: '图生视频',
  },
  'kling/omni-video': {
    en: 'Omni Video Generation',
    zh: 'Omni 视频生成',
  },
  'kling/motion-control': {
    en: 'Motion Control',
    zh: '动作控制',
  },
  'kling/multi-image-to-video': {
    en: 'Multi-Image to Video',
    zh: '多图参考生视频',
  },
  'kling/multi-elements': {
    en: 'Multimodal Video Editing',
    zh: '多模态视频编辑',
  },
  'kling/video-extension': {
    en: 'Video Extension',
    zh: '视频延长',
  },
  'kling/lip-sync': {
    en: 'Lip Sync',
    zh: '对口型',
  },
  'kling/avatar': {
    en: 'Avatar',
    zh: '数字人',
  },
  'kling/audio-generation': {
    en: 'Audio Generation',
    zh: '音频生成',
  },
  'kling/elements-voices': {
    en: 'Elements and Voices',
    zh: '主体与音色管理',
  },
  'kling/image-recognition': {
    en: 'Image Recognition',
    zh: '图像识别',
  },
  'grok/video-generation': {
    en: 'Grok Video Generation',
    zh: 'Grok 视频生成',
  },
  'happyhorse/video-generation': {
    en: 'HappyHorse Video Integration',
    zh: 'HappyHorse 视频对接',
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
