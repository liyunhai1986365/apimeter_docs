import type { Folder, Item, Root } from 'fumadocs-core/page-tree';
import type { Locale } from '@/lib/i18n';

type ApiMenuItem = {
  title: {
    zh: string;
    en: string;
  };
  operationIds?: string[];
  visibleWhenOperationIds?: string[];
  pages?: Array<{
    title: LocalizedTitle;
    href: string;
  }>;
  pageTitles?: Record<string, LocalizedTitle>;
};

type LocalizedTitle = {
  zh: string;
  en: string;
};

type ApiMenuSection = {
  title: LocalizedTitle;
  items: ApiMenuItem[];
};

type ApiMenuGroup = {
  title: {
    zh: string;
    en: string;
  };
  sections: ApiMenuSection[];
};

const apiMenuGroups: ApiMenuGroup[] = [
  {
    title: { zh: '聊天系列', en: 'Chat' },
    sections: [
      {
        title: { zh: 'OpenAI 兼容', en: 'OpenAI Compatible' },
        items: [
          { title: { zh: 'Chat Completions', en: 'Chat Completions' }, operationIds: ['createChatCompletion'] },
          { title: { zh: 'Responses', en: 'Responses' }, operationIds: ['createResponse'] },
        ],
      },
      {
        title: { zh: 'Claude', en: 'Claude' },
        items: [
          { title: { zh: 'Messages', en: 'Messages' }, operationIds: ['createMessage'] },
        ],
      },
      {
        title: { zh: 'Gemini', en: 'Gemini' },
        items: [
          { title: { zh: '原生格式', en: 'Native Format' }, operationIds: ['generateGeminiContent'] },
        ],
      },
    ],
  },
  {
    title: { zh: '图片系列', en: 'Images' },
    sections: [
      {
        title: { zh: '通用图片', en: 'Generic Images' },
        items: [
          {
            title: { zh: '通用图片生成', en: 'Generic Image Generation' },
            visibleWhenOperationIds: ['createImageGeneration'],
            pages: [
              {
                title: { zh: '通用图片生成', en: 'Generic Image Generation' },
                href: '/docs/api-reference/image/generic-image',
              },
            ],
          },
        ],
      },
      {
        title: { zh: 'OpenAI Images', en: 'OpenAI Images' },
        items: [
          { title: { zh: '图像生成', en: 'Image Generation' }, operationIds: ['createImageGeneration'] },
          { title: { zh: '图像编辑', en: 'Image Editing' }, operationIds: ['editImage'] },
          { title: { zh: '异步任务查询', en: 'Async Task Status' }, operationIds: ['getImageAsyncTask'] },
        ],
      },
      {
        title: { zh: 'Seedream 5.0', en: 'Seedream 5.0' },
        items: [
          {
            title: { zh: 'Seedream 5.0 图片生成', en: 'Seedream 5.0 Image Generation' },
            visibleWhenOperationIds: ['createImageGeneration'],
            pages: [
              {
                title: { zh: 'Seedream 5.0 图片生成', en: 'Seedream 5.0 Image Generation' },
                href: '/docs/api-reference/image/seedream-5',
              },
            ],
          },
        ],
      },
      {
        title: { zh: 'Gemini', en: 'Gemini' },
        items: [
          {
            title: { zh: 'Gemini 原生图像生成', en: 'Gemini Native Image Generation' },
            visibleWhenOperationIds: ['generateGeminiImageContent'],
            pages: [
              {
                title: { zh: 'Gemini 原生图像生成', en: 'Gemini Native Image Generation' },
                href: '/docs/api-reference/image/gemini-native-image',
              },
            ],
          },
          { title: { zh: '原生接口参考', en: 'Native API Reference' }, operationIds: ['generateGeminiImageContent'] },
        ],
      },
      {
        title: { zh: 'Midjourney', en: 'Midjourney' },
        items: [
          {
            title: { zh: '对接说明', en: 'Integration Guide' },
            visibleWhenOperationIds: ['createMidjourneyImagine'],
            pages: [
              {
                title: { zh: '对接说明', en: 'Integration Guide' },
                href: '/docs/api-reference/midjourney/integration',
              },
            ],
          },
          { title: { zh: '提交绘图', en: 'Submit Imagine' }, operationIds: ['createMidjourneyImagine'] },
          { title: { zh: '图片编辑', en: 'Image Editing' }, operationIds: ['editMidjourneyImage'] },
          { title: { zh: '视频生成', en: 'Video Generation' }, operationIds: ['createMidjourneyVideo'] },
          { title: { zh: '查询任务', en: 'Task Status' }, operationIds: ['getMidjourneyTask'] },
          {
            title: { zh: '批量查询任务', en: 'Batch Task Status' },
            operationIds: ['listMidjourneyTasksByCondition'],
          },
          { title: { zh: '换脸任务', en: 'Face Swap' }, operationIds: ['createMidjourneyFaceSwap'] },
          { title: { zh: '提交动作', en: 'Submit Action' }, operationIds: ['submitMidjourneyAction'] },
          { title: { zh: '局部重绘', en: 'Inpainting Modal' }, operationIds: ['submitMidjourneyModal'] },
        ],
      },
    ],
  },
  {
    title: { zh: '视频系列', en: 'Videos' },
    sections: [
      {
        title: { zh: 'OpenAI 兼容', en: 'OpenAI Compatible' },
        items: [
          { title: { zh: '视频生成', en: 'Video Generation' }, operationIds: ['createOpenAIVideo'] },
          { title: { zh: '查询视频任务', en: 'Video Task Status' }, operationIds: ['getOpenAIVideo'] },
          { title: { zh: '下载视频内容', en: 'Download Video Content' }, operationIds: ['downloadVideoContent'] },
          { title: { zh: 'Remix 视频', en: 'Video Remix' }, operationIds: ['post_v1_videos_video_id_remix'] },
        ],
      },
      {
        title: { zh: '通用视频', en: 'Generic Video' },
        items: [
          {
            title: { zh: 'Seedance 2.0 通用调用', en: 'Seedance 2.0 Generic Format' },
            visibleWhenOperationIds: ['createVideoGeneration'],
            pages: [
              {
                title: { zh: 'Seedance 2.0 通用调用', en: 'Seedance 2.0 Generic Format' },
                href: '/docs/api-reference/seedance-2/generic-video',
              },
            ],
          },
          {
            title: { zh: 'Seedance 2.0 素材上传', en: 'Seedance 2.0 Assets' },
            visibleWhenOperationIds: ['uploadSeedanceAsset'],
            pages: [
              {
                title: { zh: 'Seedance 2.0 素材上传', en: 'Seedance 2.0 Assets' },
                href: '/docs/api-reference/seedance-2/assets',
              },
            ],
          },
          { title: { zh: '视频生成', en: 'Video Generation' }, operationIds: ['createVideoGeneration'] },
          { title: { zh: '查询视频任务', en: 'Video Task Status' }, operationIds: ['getVideoGeneration'] },
        ],
      },
      {
        title: { zh: 'Grok 视频', en: 'Grok Video' },
        items: [
          {
            title: { zh: 'Grok 视频生成', en: 'Grok Video Generation' },
            visibleWhenOperationIds: ['createOpenAIVideo'],
            pages: [
              {
                title: { zh: 'Grok 视频生成', en: 'Grok Video Generation' },
                href: '/docs/api-reference/grok/video-generation',
              },
            ],
          },
        ],
      },
      {
        title: { zh: 'HappyHorse 视频', en: 'HappyHorse Video' },
        items: [
          {
            title: { zh: 'HappyHorse 视频对接', en: 'HappyHorse Video Integration' },
            visibleWhenOperationIds: ['createVideoGeneration'],
            pages: [
              {
                title: { zh: 'HappyHorse 视频对接', en: 'HappyHorse Video Integration' },
                href: '/docs/api-reference/happyhorse/video-generation',
              },
            ],
          },
        ],
      },
      {
        title: { zh: 'Omni 视频', en: 'Omni Video' },
        items: [
          {
            title: { zh: 'Omni 视频模型概览', en: 'Omni Video Model Overview' },
            visibleWhenOperationIds: ['createOpenAIVideo'],
            pages: [
              {
                title: { zh: 'Omni 视频模型概览', en: 'Omni Video Model Overview' },
                href: '/docs/api-reference/omni/overview',
              },
            ],
          },
          {
            title: { zh: 'omni-fast 视频生成', en: 'omni-fast Video Generation' },
            visibleWhenOperationIds: ['createOpenAIVideo'],
            pages: [
              {
                title: { zh: 'omni-fast 视频生成', en: 'omni-fast Video Generation' },
                href: '/docs/api-reference/omni/omni-fast',
              },
            ],
          },
          {
            title: { zh: 'omni-fast-v2v 参考视频生成', en: 'omni-fast-v2v Reference Video Generation' },
            visibleWhenOperationIds: ['createOpenAIVideo'],
            pages: [
              {
                title: { zh: 'omni-fast-v2v 参考视频生成', en: 'omni-fast-v2v Reference Video Generation' },
                href: '/docs/api-reference/omni/omni-fast-v2v',
              },
            ],
          },
        ],
      },
      {
        title: { zh: 'Seedance 2.0', en: 'Seedance 2.0' },
        items: [
          {
            title: { zh: '接口概览与格式选择', en: 'Overview and Formats' },
            visibleWhenOperationIds: ['createSeedance2VideoTask'],
            pages: [
              {
                title: { zh: '接口概览与格式选择', en: 'Overview and Formats' },
                href: '/docs/api-reference/seedance-2/overview',
              },
            ],
          },
          {
            title: { zh: '素材上传与管理', en: 'Asset Upload and Management' },
            visibleWhenOperationIds: ['uploadSeedanceAsset'],
            pages: [
              {
                title: { zh: '素材上传与管理', en: 'Asset Upload and Management' },
                href: '/docs/api-reference/seedance-2/assets',
              },
            ],
          },
          {
            title: { zh: '通用视频格式调用', en: 'Generic Video Format' },
            visibleWhenOperationIds: ['createVideoGeneration'],
            pages: [
              {
                title: { zh: '通用视频格式调用', en: 'Generic Video Format' },
                href: '/docs/api-reference/seedance-2/generic-video',
              },
            ],
          },
          {
            title: { zh: '生成模式示例', en: 'Generation Mode Examples' },
            visibleWhenOperationIds: ['createSeedance2VideoTask'],
            pages: [
              {
                title: { zh: '生成模式示例', en: 'Generation Mode Examples' },
                href: '/docs/api-reference/seedance-2/modes',
              },
            ],
          },
          {
            title: { zh: 'Python 轮询与下载', en: 'Python Polling and Download' },
            visibleWhenOperationIds: ['getSeedance2VideoTask'],
            pages: [
              {
                title: { zh: 'Python 轮询与下载', en: 'Python Polling and Download' },
                href: '/docs/api-reference/seedance-2/python-polling',
              },
            ],
          },
          { title: { zh: '视频生成', en: 'Video Generation' }, operationIds: ['createSeedance2VideoTask'] },
          { title: { zh: '查询视频任务', en: 'Video Task Status' }, operationIds: ['getSeedance2VideoTask'] },
          {
            title: { zh: '素材管理', en: 'Assets' },
            operationIds: [
              'uploadSeedanceAsset',
              'getSeedanceAsset',
            ],
            pageTitles: {
              uploadSeedanceAsset: { zh: '上传素材', en: 'Upload Asset' },
              getSeedanceAsset: { zh: '查询素材详情', en: 'Get Asset' },
            },
          },
        ],
      },
      {
        title: { zh: 'Kling', en: 'Kling' },
        items: [
          {
            title: { zh: '可灵视频接口概览', en: 'Kling Video API Overview' },
            visibleWhenOperationIds: ['createKlingText2Video'],
            pages: [
              {
                title: { zh: '可灵视频接口概览', en: 'Kling Video API Overview' },
                href: '/docs/api-reference/kling/video-overview',
              },
              {
                title: { zh: 'Kling 3.0 Turbo 任务接口', en: 'Kling 3.0 Turbo Tasks' },
                href: '/docs/api-reference/kling/turbo-tasks',
              },
              {
                title: { zh: '文生视频', en: 'Text to Video' },
                href: '/docs/api-reference/kling/text-to-video',
              },
              {
                title: { zh: '图生视频', en: 'Image to Video' },
                href: '/docs/api-reference/kling/image-to-video',
              },
              {
                title: { zh: 'Omni 视频生成', en: 'Omni Video Generation' },
                href: '/docs/api-reference/kling/omni-video',
              },
              {
                title: { zh: '动作控制', en: 'Motion Control' },
                href: '/docs/api-reference/kling/motion-control',
              },
              {
                title: { zh: '多图参考生视频', en: 'Multi-Image to Video' },
                href: '/docs/api-reference/kling/multi-image-to-video',
              },
              {
                title: { zh: '多模态视频编辑', en: 'Multimodal Video Editing' },
                href: '/docs/api-reference/kling/multi-elements',
              },
              {
                title: { zh: '视频延长', en: 'Video Extension' },
                href: '/docs/api-reference/kling/video-extension',
              },
              {
                title: { zh: '对口型', en: 'Lip Sync' },
                href: '/docs/api-reference/kling/lip-sync',
              },
              {
                title: { zh: '数字人', en: 'Avatar' },
                href: '/docs/api-reference/kling/avatar',
              },
              {
                title: { zh: '音频生成', en: 'Audio Generation' },
                href: '/docs/api-reference/kling/audio-generation',
              },
              {
                title: { zh: '主体与音色管理', en: 'Elements and Voices' },
                href: '/docs/api-reference/kling/elements-voices',
              },
              {
                title: { zh: '图像识别', en: 'Image Recognition' },
                href: '/docs/api-reference/kling/image-recognition',
              },
            ],
          },
        ],
      },
      {
        title: { zh: '即梦', en: 'Jimeng' },
        items: [
          { title: { zh: '视频生成', en: 'Video Generation' }, operationIds: ['createJimengVideo'] },
        ],
      },
    ],
  },
  {
    title: { zh: '音频与其他', en: 'Audio & More' },
    sections: [
      {
        title: { zh: '音频', en: 'Audio' },
        items: [
          { title: { zh: '音频转录', en: 'Audio Transcription' }, operationIds: ['createTranscription'] },
          { title: { zh: '音频翻译', en: 'Audio Translation' }, operationIds: ['createTranslation'] },
          { title: { zh: '文本转语音', en: 'Text to Speech' }, operationIds: ['createSpeech'] },
        ],
      },
      {
        title: { zh: 'Suno', en: 'Suno' },
        items: [
          {
            title: { zh: '对接说明', en: 'Integration Guide' },
            visibleWhenOperationIds: ['createSunoMusic'],
            pages: [
              {
                title: { zh: '对接说明', en: 'Integration Guide' },
                href: '/docs/api-reference/suno/integration',
              },
            ],
          },
          { title: { zh: '生成音乐', en: 'Generate Music' }, operationIds: ['createSunoMusic'] },
          { title: { zh: '生成歌词', en: 'Generate Lyrics' }, operationIds: ['createSunoLyrics'] },
          { title: { zh: '查询音乐任务', en: 'Music Task Status' }, operationIds: ['getSunoTask'] },
          { title: { zh: '批量查询任务', en: 'Batch Task Status' }, operationIds: ['listSunoTasks'] },
          { title: { zh: '批量查询歌曲', en: 'Batch Song Feed' }, operationIds: ['getSunoFeed'] },
          { title: { zh: '获取 WAV', en: 'Get WAV' }, operationIds: ['getSunoWav'] },
          { title: { zh: '歌词时间线', en: 'Lyric Timing' }, operationIds: ['getSunoTiming'] },
        ],
      },
      {
        title: { zh: '其他能力', en: 'Other Capabilities' },
        items: [
          {
            title: { zh: 'Embeddings', en: 'Embeddings' },
            operationIds: ['createEmbedding', 'createEngineEmbedding'],
            pageTitles: {
              createEmbedding: { zh: 'Embeddings - OpenAI', en: 'Embeddings - OpenAI' },
              createEngineEmbedding: { zh: 'Embeddings - Gemini Engine', en: 'Embeddings - Gemini Engine' },
            },
          },
          { title: { zh: 'Rerank', en: 'Rerank' }, operationIds: ['createRerank'] },
          { title: { zh: '内容审核', en: 'Moderation' }, operationIds: ['createModeration'] },
          { title: { zh: 'Realtime', en: 'Realtime' }, operationIds: ['createRealtimeSession'] },
        ],
      },
    ],
  },
  {
    title: { zh: '管理接口', en: 'Management' },
    sections: [
      {
        title: { zh: '模型', en: 'Models' },
        items: [
          {
            title: { zh: '模型列表', en: 'Model List' },
            operationIds: ['listModels', 'get_v1beta_openai_models', 'listGeminiModels'],
            pageTitles: {
              listModels: { zh: '模型列表 - OpenAI', en: 'Model List - OpenAI' },
              get_v1beta_openai_models: { zh: '模型列表 - Gemini OpenAI', en: 'Model List - Gemini OpenAI' },
              listGeminiModels: { zh: '模型列表 - Gemini', en: 'Model List - Gemini' },
            },
          },
          { title: { zh: '模型详情', en: 'Model Details' }, operationIds: ['get_v1_models_model'] },
        ],
      },
      {
        title: { zh: '令牌管理', en: 'Token Management' },
        items: [
          {
            title: { zh: '令牌管理', en: 'Token Management' },
            operationIds: [
              'listTokens',
              'createToken',
              'updateToken',
              'batchDeleteTokens',
              'searchTokens',
              'getToken',
              'deleteToken',
              'getTokenUsage',
              'post_api_token_id_key',
              'post_api_token_batch_keys',
            ],
            pageTitles: {
              listTokens: { zh: '获取所有令牌', en: 'List Tokens' },
              createToken: { zh: '创建令牌', en: 'Create Token' },
              updateToken: { zh: '更新令牌', en: 'Update Token' },
              batchDeleteTokens: { zh: '批量删除令牌', en: 'Batch Delete Tokens' },
              searchTokens: { zh: '搜索令牌', en: 'Search Tokens' },
              getToken: { zh: '获取指定令牌', en: 'Get Token' },
              deleteToken: { zh: '删除令牌', en: 'Delete Token' },
              getTokenUsage: { zh: '获取令牌使用情况', en: 'Get Token Usage' },
              post_api_token_id_key: { zh: '查看指定令牌密钥', en: 'View Token Key' },
              post_api_token_batch_keys: { zh: '批量查看令牌密钥', en: 'Batch View Token Keys' },
            },
          },
        ],
      },
      {
        title: { zh: '日志', en: 'Logs' },
        items: [
          {
            title: { zh: '日志查询', en: 'Log Queries' },
            operationIds: [
              'listLogs',
              'deleteLogs',
              'searchLogs',
              'listSelfLogs',
              'searchSelfLogs',
              'getSelfLogStat',
              'getLogStat',
              'getTokenLogs',
            ],
            pageTitles: {
              listLogs: { zh: '获取所有日志', en: 'List Logs' },
              deleteLogs: { zh: '删除历史日志', en: 'Delete Logs' },
              searchLogs: { zh: '搜索日志', en: 'Search Logs' },
              listSelfLogs: { zh: '获取个人日志', en: 'List My Logs' },
              searchSelfLogs: { zh: '搜索个人日志', en: 'Search My Logs' },
              getSelfLogStat: { zh: '获取个人日志统计', en: 'My Log Stats' },
              getLogStat: { zh: '获取日志统计', en: 'Log Stats' },
              getTokenLogs: { zh: '通过令牌获取日志', en: 'Token Logs' },
            },
          },
        ],
      },
      {
        title: { zh: '真人认证', en: 'Visual Verification' },
        items: [
          {
            title: { zh: '真人认证', en: 'Visual Verification' },
            operationIds: [
              'createVisualValidateSession',
              'getVisualValidateSession',
              'uploadVisualValidateAsset',
              'listVisualValidateAssets',
              'getVisualValidateAsset',
              'deleteVisualValidateAsset',
              'deleteVisualValidateAssetGroup',
            ],
            pageTitles: {
              createVisualValidateSession: { zh: '创建真人认证会话', en: 'Create Verification Session' },
              getVisualValidateSession: { zh: '获取真人认证结果', en: 'Get Verification Result' },
              uploadVisualValidateAsset: { zh: '上传人像素材', en: 'Upload Face Asset' },
              listVisualValidateAssets: { zh: '查询人像素材列表', en: 'List Face Assets' },
              getVisualValidateAsset: { zh: '查询单个人像素材详情', en: 'Get Face Asset' },
              deleteVisualValidateAsset: { zh: '删除人像素材', en: 'Delete Face Asset' },
              deleteVisualValidateAssetGroup: { zh: '删除人像素材组', en: 'Delete Face Asset Group' },
            },
          },
        ],
      },
    ],
  },
];

const hiddenOperationIds = new Set([
  'post_pg_chat_completions',
  'createKlingText2Video',
  'getKlingText2Video',
  'createKlingImage2Video',
  'getKlingImage2Video',
]);

function localizeApiUrl(url: string, locale: Locale) {
  if (locale === 'en') return url;

  return `/${locale}${url}`;
}

function titleFor(locale: Locale, title: LocalizedTitle) {
  return locale === 'zh' ? title.zh : title.en;
}

function operationIdFromUrl(url: string) {
  const lastSegment = url.split('/').filter(Boolean).at(-1);

  return lastSegment ? decodeURIComponent(lastSegment) : '';
}

function isHiddenPage(page: Item) {
  return hiddenOperationIds.has(operationIdFromUrl(page.url));
}

function clonePage(page: Item, name: string, locale: Locale): Item {
  return {
    ...page,
    name,
    url: localizeApiUrl(page.url, locale),
  };
}

function itemPageTitle(item: ApiMenuItem, operationId: string, index: number, locale: Locale) {
  const configured = item.pageTitles?.[operationId];
  if (configured) return titleFor(locale, configured);

  const baseTitle = titleFor(locale, item.title);
  return `${baseTitle} ${index + 1}`;
}

function sourceGroupDisplayName(name: string, locale: Locale) {
  const displayName = name.replace(/^(?:AI|A\s+I)\s*模型\s*(?:[-－]\s*)?/, '');
  const normalized = displayName === '图像' ? '图片' : displayName;

  if (locale === 'zh') return normalized;

  const translations: Record<string, string> = {
    账户管理: 'Account',
    聊天系列: 'Chat',
    图片系列: 'Images',
    视频系列: 'Videos',
    补全: 'Completions',
    嵌入: 'Embeddings',
    音频: 'Audio',
    重排序: 'Rerank',
    内容审核: 'Moderation',
    实时: 'Realtime',
    '管理接口 - 鉴权': 'Management - Auth',
    '管理接口 - 令牌管理': 'Management - Tokens',
    '管理接口 - 日志': 'Management - Logs',
    '管理接口 - 真人认证': 'Management - Visual Verification',
  };

  return translations[normalized] ?? normalized;
}

function collectSourceGroups(tree: Root) {
  const groups: Array<{ name: string; pages: Item[] }> = [];
  let current: { name: string; pages: Item[] } | undefined;

  for (const node of tree.children) {
    if (node.type === 'separator') {
      current = { name: String(node.name), pages: [] };
      groups.push(current);
      continue;
    }

    if (node.type === 'page') {
      if (!current) {
        current = { name: '', pages: [] };
        groups.push(current);
      }
      current.pages.push(node);
      continue;
    }

    if (node.type === 'folder') {
      const pages = node.children.filter((child): child is Item => child.type === 'page');
      groups.push({ name: String(node.name), pages });
    }
  }

  return groups;
}

export function getLocalizedApiPageTree(tree: Root, locale: Locale): Root {
  const groups = collectSourceGroups(tree);
  const pageByOperationId = new Map<string, Item>();

  for (const group of groups) {
    for (const page of group.pages) {
      pageByOperationId.set(operationIdFromUrl(page.url), page);
    }
  }

  const usedPages = new Set<Item>();
  const children: Folder[] = [];

  for (const group of apiMenuGroups) {
    const sectionFolders: Folder[] = [];

    for (const section of group.sections) {
      const sectionChildren: Item[] = [];

      for (const item of section.items) {
        const itemPages = (item.operationIds ?? [])
          .map((operationId) => {
            const page = pageByOperationId.get(operationId);
            return page ? { operationId, page } : undefined;
          })
          .filter((entry): entry is { operationId: string; page: Item } => Boolean(entry));

        const pageItemsVisible =
          item.visibleWhenOperationIds?.some((operationId) => pageByOperationId.has(operationId)) ??
          itemPages.length > 0;

        if (pageItemsVisible) {
          for (const page of item.pages ?? []) {
            sectionChildren.push({
              type: 'page',
              name: titleFor(locale, page.title),
              url: localizeApiUrl(page.href, locale),
            });
          }
        }

        itemPages.forEach(({ page }) => usedPages.add(page));

        if (itemPages.length === 1) {
          sectionChildren.push(clonePage(itemPages[0].page, titleFor(locale, item.title), locale));
        } else if (itemPages.length > 1) {
          for (const [index, { operationId, page }] of itemPages.entries()) {
            sectionChildren.push(clonePage(page, itemPageTitle(item, operationId, index, locale), locale));
          }
        }
      }

      if (sectionChildren.length > 0) {
        sectionFolders.push({
          type: 'folder',
          name: titleFor(locale, section.title),
          children: sectionChildren,
        });
      }
    }

    if (sectionFolders.length > 0) {
      children.push({
        type: 'folder',
        name: titleFor(locale, group.title),
        defaultOpen: true,
        children: sectionFolders,
      });
    }
  }

  for (const group of groups) {
    const remainingPages = group.pages.filter((page) => !usedPages.has(page) && !isHiddenPage(page));
    if (remainingPages.length === 0) continue;

    children.push({
      type: 'folder',
      name: sourceGroupDisplayName(group.name, locale),
      defaultOpen: true,
      children: remainingPages.map((page) => ({
        ...page,
        url: localizeApiUrl(page.url, locale),
      })),
    });
  }

  return {
    ...tree,
    children,
  };
}
