import type { Item, Root } from 'fumadocs-core/page-tree';
import { describe, expect, it } from 'vitest';
import { getLocalizedApiPageTree } from './api-page-tree';

function page(name: Item['name'], operationId: string): Item {
  return {
    type: 'page',
    name,
    url: `/docs/api-reference/${operationId}`,
  };
}

describe('getLocalizedApiPageTree', () => {
  it.each(['zh', 'en'] as const)('consolidates asset operations into one %s navigation entry', (locale) => {
    for (const operationIds of [
      ['seedanceAssetAction'],
      ['seedanceAssetAction', 'uploadSeedanceAsset'],
      ['seedanceAssetAction', 'uploadSeedanceAsset', 'getSeedanceAsset'],
    ]) {
      const tree: Root = {
        type: 'root', name: '',
        children: [
          { type: 'separator', name: '视频系列' },
          ...operationIds.map((id) => page(id, id)),
        ],
      };
      const localized = getLocalizedApiPageTree(tree, locale);
      const pages: Item[] = [];
      function collect(nodes: Root['children']) {
        for (const node of nodes) {
          if (node.type === 'page') pages.push(node);
          if (node.type === 'folder') collect(node.children);
        }
      }
      collect(localized.children);
      expect(pages).toHaveLength(1);
      expect(pages[0].name).toBe(locale === 'zh' ? '素材库（官方格式）' : 'Assets (Official Format)');
      expect(pages[0].url).toContain('/seedance-2/assets');
    }
  });

  it('builds a four-level Chinese API reference tree from generated OpenAPI pages', () => {
    const tree: Root = {
      type: 'root',
      name: '',
      children: [
        { type: 'separator', name: '聊天系列' },
        page('ChatCompletions 格式', 'createChatCompletion'),
        page('Responses 格式', 'createResponse'),
        page('Claude 格式', 'createMessage'),
        page('Playground 聊天调试', 'post_pg_chat_completions'),
        { type: 'separator', name: '图片系列' },
        page('生成图像', 'createImageGeneration'),
        page('查询图片异步任务', 'getImageAsyncTask'),
        page('Gemini 原生图像生成', 'generateGeminiImageContent'),
        page('Midjourney 提交绘图', 'createMidjourneyImagine'),
        page('Midjourney 图片编辑', 'editMidjourneyImage'),
        page('Midjourney 视频生成', 'createMidjourneyVideo'),
        page('Midjourney 查询任务', 'getMidjourneyTask'),
        page('Midjourney 批量查询任务', 'listMidjourneyTasksByCondition'),
        page('Midjourney 换脸任务', 'createMidjourneyFaceSwap'),
        page('Midjourney 提交动作', 'submitMidjourneyAction'),
        page('Midjourney 局部重绘', 'submitMidjourneyModal'),
        { type: 'separator', name: '视频系列' },
        page('OpenAI 兼容视频生成', 'createOpenAIVideo'),
        page('查询视频任务', 'getOpenAIVideo'),
        page('下载视频内容', 'downloadVideoContent'),
        page('创建视频生成任务', 'createVideoGeneration'),
        page('查询视频生成任务', 'getVideoGeneration'),
        page('Seedance 2.0 视频生成', 'createSeedance2VideoTask'),
        page('查询 Seedance 2.0 视频任务', 'getSeedance2VideoTask'),
        page('Seedance 素材库（官方格式）', 'seedanceAssetAction'),
        page('上传 Seedance 2.0 素材', 'uploadSeedanceAsset'),
        page('查询 Seedance 2.0 素材详情', 'getSeedanceAsset'),
        page('Kling 文生视频', 'createKlingText2Video'),
        page('获取 Kling 文生视频任务状态', 'getKlingText2Video'),
        page('Kling 图生视频', 'createKlingImage2Video'),
        page('获取 Kling 图生视频任务状态', 'getKlingImage2Video'),
        page('即梦视频生成', 'createJimengVideo'),
        { type: 'separator', name: 'AI 模型 - 音频' },
        page('音频转录', 'createTranscription'),
        page('音频翻译', 'createTranslation'),
        page('文本转语音', 'createSpeech'),
        page('Suno 生成音乐', 'createSunoMusic'),
        page('Suno 生成歌词', 'createSunoLyrics'),
        page('Suno 查询音乐任务', 'getSunoTask'),
        page('Suno 批量查询任务', 'listSunoTasks'),
        page('Suno 批量查询歌曲', 'getSunoFeed'),
        page('Suno 获取 WAV', 'getSunoWav'),
        page('Suno 歌词时间线', 'getSunoTiming'),
        { type: 'separator', name: '账户管理' },
        page('OpenAI 格式', 'listModels'),
        page('获取指定模型详情', 'get_v1_models_model'),
      ],
    };

    expect(getLocalizedApiPageTree(tree, 'zh')).toMatchObject({
      children: [
        {
          type: 'folder',
          name: '聊天系列',
          children: [
            {
              type: 'folder',
              name: 'OpenAI 兼容',
              children: [
                {
                  type: 'page',
                  name: 'Chat Completions',
                  url: '/zh/docs/api-reference/createChatCompletion',
                },
                {
                  type: 'page',
                  name: 'Responses',
                  url: '/zh/docs/api-reference/createResponse',
                },
              ],
            },
            {
              type: 'folder',
              name: 'Claude',
              children: [
                {
                  type: 'page',
                  name: 'Messages',
                  url: '/zh/docs/api-reference/createMessage',
                },
              ],
            },
          ],
        },
        {
          type: 'folder',
          name: '图片系列',
          children: [
            {
              type: 'folder',
              name: '通用图片',
              children: [
                {
                  type: 'page',
                  name: '通用图片生成',
                  url: '/zh/docs/api-reference/image/generic-image',
                },
              ],
            },
            {
              type: 'folder',
              name: 'OpenAI Images',
              children: [
                {
                  type: 'page',
                  name: '图像生成',
                  url: '/zh/docs/api-reference/createImageGeneration',
                },
                {
                  type: 'page',
                  name: '异步任务查询',
                  url: '/zh/docs/api-reference/getImageAsyncTask',
                },
              ],
            },
            {
              type: 'folder',
              name: 'Seedream 5.0',
              children: [
                {
                  type: 'page',
                  name: 'Seedream 5.0 图片生成',
                  url: '/zh/docs/api-reference/image/seedream-5',
                },
              ],
            },
            {
              type: 'folder',
              name: 'Gemini',
              children: [
                {
                  type: 'page',
                  name: 'Gemini 原生图像生成',
                  url: '/zh/docs/api-reference/image/gemini-native-image',
                },
                {
                  type: 'page',
                  name: '原生接口参考',
                  url: '/zh/docs/api-reference/generateGeminiImageContent',
                },
              ],
            },
            {
              type: 'folder',
              name: 'Midjourney',
              children: [
                {
                  type: 'page',
                  name: '对接说明',
                  url: '/zh/docs/api-reference/midjourney/integration',
                },
                {
                  type: 'page',
                  name: '提交绘图',
                  url: '/zh/docs/api-reference/createMidjourneyImagine',
                },
                {
                  type: 'page',
                  name: '图片编辑',
                  url: '/zh/docs/api-reference/editMidjourneyImage',
                },
                {
                  type: 'page',
                  name: '视频生成',
                  url: '/zh/docs/api-reference/createMidjourneyVideo',
                },
                {
                  type: 'page',
                  name: '查询任务',
                  url: '/zh/docs/api-reference/getMidjourneyTask',
                },
                {
                  type: 'page',
                  name: '批量查询任务',
                  url: '/zh/docs/api-reference/listMidjourneyTasksByCondition',
                },
                {
                  type: 'page',
                  name: '换脸任务',
                  url: '/zh/docs/api-reference/createMidjourneyFaceSwap',
                },
                {
                  type: 'page',
                  name: '提交动作',
                  url: '/zh/docs/api-reference/submitMidjourneyAction',
                },
                {
                  type: 'page',
                  name: '局部重绘',
                  url: '/zh/docs/api-reference/submitMidjourneyModal',
                },
              ],
            },
          ],
        },
        {
          type: 'folder',
          name: '视频系列',
          children: [
            {
              type: 'folder',
              name: 'OpenAI 兼容',
              children: [
                {
                  type: 'page',
                  name: '视频生成',
                  url: '/zh/docs/api-reference/createOpenAIVideo',
                },
                {
                  type: 'page',
                  name: '查询视频任务',
                  url: '/zh/docs/api-reference/getOpenAIVideo',
                },
                {
                  type: 'page',
                  name: '下载视频内容',
                  url: '/zh/docs/api-reference/downloadVideoContent',
                },
              ],
            },
            {
              type: 'folder',
              name: '通用视频',
              children: [
                {
                  type: 'page',
                  name: 'Seedance 2.0 通用调用',
                  url: '/zh/docs/api-reference/seedance-2/generic-video',
                },
                {
                  type: 'page',
                  name: '视频生成',
                  url: '/zh/docs/api-reference/createVideoGeneration',
                },
                {
                  type: 'page',
                  name: '查询视频任务',
                  url: '/zh/docs/api-reference/getVideoGeneration',
                },
              ],
            },
            {
              type: 'folder',
              name: 'Grok 视频',
              children: [
                {
                  type: 'page',
                  name: 'Grok 视频生成',
                  url: '/zh/docs/api-reference/grok/video-generation',
                },
              ],
            },
            {
              type: 'folder',
              name: 'HappyHorse 视频',
              children: [
                {
                  type: 'page',
                  name: 'HappyHorse 视频对接',
                  url: '/zh/docs/api-reference/happyhorse/video-generation',
                },
              ],
            },
            {
              type: 'folder',
              name: 'Omni 视频',
              children: [
                {
                  type: 'page',
                  name: 'Omni 视频模型概览',
                  url: '/zh/docs/api-reference/omni/overview',
                },
                {
                  type: 'page',
                  name: 'omni-fast 视频生成',
                  url: '/zh/docs/api-reference/omni/omni-fast',
                },
                {
                  type: 'page',
                  name: 'omni-fast-v2v 参考视频生成',
                  url: '/zh/docs/api-reference/omni/omni-fast-v2v',
                },
              ],
            },
            {
              type: 'folder',
              name: 'Seedance（官方格式）',
              children: [
                {
                  type: 'page',
                  name: '官方格式接口概览',
                  url: '/zh/docs/api-reference/seedance-2/overview',
                },
                {
                  type: 'page',
                  name: '素材库（官方格式）',
                  url: '/zh/docs/api-reference/seedance-2/assets',
                },
                {
                  type: 'page',
                  name: '生成模式示例',
                  url: '/zh/docs/api-reference/seedance-2/modes',
                },
                {
                  type: 'page',
                  name: 'Python 轮询与下载',
                  url: '/zh/docs/api-reference/seedance-2/python-polling',
                },
                {
                  type: 'page',
                  name: '视频生成',
                  url: '/zh/docs/api-reference/createSeedance2VideoTask',
                },
                {
                  type: 'page',
                  name: '查询视频任务',
                  url: '/zh/docs/api-reference/getSeedance2VideoTask',
                },
              ],
            },
            {
              type: 'folder',
              name: 'Kling',
              children: [
                {
                  type: 'page',
                  name: '可灵视频接口概览',
                  url: '/zh/docs/api-reference/kling/video-overview',
                },
                {
                  type: 'page',
                  name: 'Kling 3.0 Turbo 任务接口',
                  url: '/zh/docs/api-reference/kling/turbo-tasks',
                },
                {
                  type: 'page',
                  name: '文生视频',
                  url: '/zh/docs/api-reference/kling/text-to-video',
                },
                {
                  type: 'page',
                  name: '图生视频',
                  url: '/zh/docs/api-reference/kling/image-to-video',
                },
                {
                  type: 'page',
                  name: 'Omni 视频生成',
                  url: '/zh/docs/api-reference/kling/omni-video',
                },
                {
                  type: 'page',
                  name: '动作控制',
                  url: '/zh/docs/api-reference/kling/motion-control',
                },
                {
                  type: 'page',
                  name: '多图参考生视频',
                  url: '/zh/docs/api-reference/kling/multi-image-to-video',
                },
                {
                  type: 'page',
                  name: '多模态视频编辑',
                  url: '/zh/docs/api-reference/kling/multi-elements',
                },
                {
                  type: 'page',
                  name: '视频延长',
                  url: '/zh/docs/api-reference/kling/video-extension',
                },
                {
                  type: 'page',
                  name: '对口型',
                  url: '/zh/docs/api-reference/kling/lip-sync',
                },
                {
                  type: 'page',
                  name: '数字人',
                  url: '/zh/docs/api-reference/kling/avatar',
                },
                {
                  type: 'page',
                  name: '音频生成',
                  url: '/zh/docs/api-reference/kling/audio-generation',
                },
                {
                  type: 'page',
                  name: '主体与音色管理',
                  url: '/zh/docs/api-reference/kling/elements-voices',
                },
                {
                  type: 'page',
                  name: '图像识别',
                  url: '/zh/docs/api-reference/kling/image-recognition',
                },
              ],
            },
            {
              type: 'folder',
              name: '即梦',
              children: [
                {
                  type: 'page',
                  name: '视频生成',
                  url: '/zh/docs/api-reference/createJimengVideo',
                },
              ],
            },
          ],
        },
        {
          type: 'folder',
          name: '音频与其他',
          children: [
            {
              type: 'folder',
              name: '音频',
              children: [
                {
                  type: 'page',
                  name: '音频转录',
                  url: '/zh/docs/api-reference/createTranscription',
                },
                {
                  type: 'page',
                  name: '音频翻译',
                  url: '/zh/docs/api-reference/createTranslation',
                },
                {
                  type: 'page',
                  name: '文本转语音',
                  url: '/zh/docs/api-reference/createSpeech',
                },
              ],
            },
            {
              type: 'folder',
              name: 'MiMo',
              children: [
                {
                  type: 'page',
                  name: '语音识别',
                  url: '/zh/docs/api-reference/mimo/speech-recognition',
                },
                {
                  type: 'page',
                  name: '语音合成',
                  url: '/zh/docs/api-reference/mimo/speech-synthesis',
                },
              ],
            },
            {
              type: 'folder',
              name: 'Suno',
              children: [
                {
                  type: 'page',
                  name: '对接说明',
                  url: '/zh/docs/api-reference/suno/integration',
                },
                {
                  type: 'page',
                  name: '生成音乐',
                  url: '/zh/docs/api-reference/createSunoMusic',
                },
                {
                  type: 'page',
                  name: '生成歌词',
                  url: '/zh/docs/api-reference/createSunoLyrics',
                },
                {
                  type: 'page',
                  name: '查询音乐任务',
                  url: '/zh/docs/api-reference/getSunoTask',
                },
                {
                  type: 'page',
                  name: '批量查询任务',
                  url: '/zh/docs/api-reference/listSunoTasks',
                },
                {
                  type: 'page',
                  name: '批量查询歌曲',
                  url: '/zh/docs/api-reference/getSunoFeed',
                },
                {
                  type: 'page',
                  name: '获取 WAV',
                  url: '/zh/docs/api-reference/getSunoWav',
                },
                {
                  type: 'page',
                  name: '歌词时间线',
                  url: '/zh/docs/api-reference/getSunoTiming',
                },
              ],
            },
          ],
        },
        {
          type: 'folder',
          name: '管理接口',
          children: [
            {
              type: 'folder',
              name: '模型',
              children: [
                { type: 'page', name: '模型列表', url: '/zh/docs/api-reference/listModels' },
                {
                  type: 'page',
                  name: '模型详情',
                  url: '/zh/docs/api-reference/get_v1_models_model',
                },
              ],
            },
          ],
        },
      ],
    });

    expect(
      getLocalizedApiPageTree(tree, 'zh').children.some(
        (node) => node.type === 'folder' && node.name === '接入基础',
      ),
    ).toBe(false);
    expect(
      getLocalizedApiPageTree(tree, 'zh').children.some(
        (node) => node.type === 'folder' && node.name === '补全',
      ),
    ).toBe(false);
    const chatFolder = getLocalizedApiPageTree(tree, 'zh').children.find(
      (node) => node.type === 'folder' && node.name === '聊天系列',
    );
    expect(chatFolder).toMatchObject({
      type: 'folder',
      children: expect.not.arrayContaining([
        expect.objectContaining({
          type: 'folder',
          name: '调试',
        }),
      ]),
    });
    expect(JSON.stringify(getLocalizedApiPageTree(tree, 'zh').children)).not.toContain(
      'post_pg_chat_completions',
    );
    expect(JSON.stringify(getLocalizedApiPageTree(tree, 'zh').children)).not.toContain('Playground 聊天调试');
  });

  it('keeps unmapped API pages in their localized source group', () => {
    const tree: Root = {
      type: 'root',
      name: '',
      children: [
        { type: 'separator', name: '管理接口 - 日志' },
        page('搜索日志', 'unknownLogOperation'),
      ],
    };

    expect(getLocalizedApiPageTree(tree, 'en')).toMatchObject({
      children: [
        {
          type: 'folder',
          name: 'Management - Logs',
          children: [
            {
              type: 'page',
              name: '搜索日志',
              url: '/docs/api-reference/unknownLogOperation',
            },
          ],
        },
      ],
    });
  });

  it('does not stringify React node page names as object labels', () => {
    const tree: Root = {
      type: 'root',
      name: '',
      children: [
        { type: 'separator', name: '账户管理' },
        page({ label: 'OpenAI 格式' } as unknown as Item['name'], 'listModels'),
        page({ label: 'Gemini 格式' } as unknown as Item['name'], 'listGeminiModels'),
      ],
    };

    expect(getLocalizedApiPageTree(tree, 'zh')).toMatchObject({
      children: [
        {
          type: 'folder',
          name: '管理接口',
          children: [
            {
              type: 'folder',
              name: '模型',
              children: [
                {
                  type: 'page',
                  name: '模型列表 - OpenAI',
                  url: '/zh/docs/api-reference/listModels',
                },
                {
                  type: 'page',
                  name: '模型列表 - Gemini',
                  url: '/zh/docs/api-reference/listGeminiModels',
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('keeps top-level API folders open while nested folders start collapsed', () => {
    const tree: Root = {
      type: 'root',
      name: '',
      children: [
        { type: 'separator', name: '图片系列' },
        page('生成图像', 'createImageGeneration'),
      ],
    };

    expect(getLocalizedApiPageTree(tree, 'zh')).toMatchObject({
      children: [
        {
          type: 'folder',
          name: '图片系列',
          defaultOpen: true,
          children: [
            {
              type: 'folder',
              name: '通用图片',
              children: [
                {
                  type: 'page',
                  name: '通用图片生成',
                  url: '/zh/docs/api-reference/image/generic-image',
                },
              ],
            },
            {
              type: 'folder',
              name: 'OpenAI Images',
              children: [
                {
                  type: 'page',
                  name: '图像生成',
                  url: '/zh/docs/api-reference/createImageGeneration',
                },
              ],
            },
            {
              type: 'folder',
              name: 'Seedream 5.0',
              children: [
                {
                  type: 'page',
                  name: 'Seedream 5.0 图片生成',
                  url: '/zh/docs/api-reference/image/seedream-5',
                },
              ],
            },
          ],
        },
      ],
    });

    const imageFolder = getLocalizedApiPageTree(tree, 'zh').children[0];
    expect(imageFolder).not.toHaveProperty('collapsible', false);
    if (imageFolder.type === 'folder') {
      expect(imageFolder.children[0]).not.toHaveProperty('collapsible', false);
      expect(imageFolder.children[0]).not.toHaveProperty('defaultOpen', true);
    }
  });
});
