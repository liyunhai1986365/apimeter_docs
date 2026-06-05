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
  it('builds a four-level Chinese API reference tree from generated OpenAPI pages', () => {
    const tree: Root = {
      type: 'root',
      name: '',
      children: [
        { type: 'separator', name: '聊天系列' },
        page('ChatCompletions 格式', 'createChatCompletion'),
        page('原生 OpenAI 格式', 'createCompletion'),
        page('Responses 格式', 'createResponse'),
        page('Claude 格式', 'createMessage'),
        { type: 'separator', name: '图片系列' },
        page('生成图像', 'createImageGeneration'),
        page('查询图片异步任务', 'getImageAsyncTask'),
        { type: 'separator', name: '视频系列' },
        page('OpenAI 兼容视频生成', 'createOpenAIVideo'),
        page('查询视频任务', 'getOpenAIVideo'),
        page('下载视频内容', 'downloadVideoContent'),
        page('Kling 文生视频', 'createKlingText2Video'),
        page('获取 Kling 文生视频任务状态', 'getKlingText2Video'),
        page('Kling 图生视频', 'createKlingImage2Video'),
        page('获取 Kling 图生视频任务状态', 'getKlingImage2Video'),
        page('即梦视频生成', 'createJimengVideo'),
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
                  name: 'Completions',
                  url: '/zh/docs/api-reference/createCompletion',
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
              name: 'Kling',
              children: [
                {
                  type: 'page',
                  name: '文生视频',
                  url: '/zh/docs/api-reference/createKlingText2Video',
                },
                {
                  type: 'page',
                  name: '查询文生视频任务',
                  url: '/zh/docs/api-reference/getKlingText2Video',
                },
                {
                  type: 'page',
                  name: '图生视频',
                  url: '/zh/docs/api-reference/createKlingImage2Video',
                },
                {
                  type: 'page',
                  name: '查询图生视频任务',
                  url: '/zh/docs/api-reference/getKlingImage2Video',
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
});
