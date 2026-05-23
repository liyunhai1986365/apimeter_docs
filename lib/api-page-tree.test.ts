import type { Root } from 'fumadocs-core/page-tree';
import { describe, expect, it } from 'vitest';
import { getApiGroupDisplayName, getLocalizedApiPageTree } from './api-page-tree';

describe('getApiGroupDisplayName', () => {
  it('shows AI model API groups by capability name only', () => {
    expect(getApiGroupDisplayName('AI 模型 - 聊天')).toBe('聊天');
    expect(getApiGroupDisplayName('A I 模型 图像')).toBe('图片');
    expect(getApiGroupDisplayName('AI 模型 - 视频')).toBe('视频');
    expect(getApiGroupDisplayName('AI 模型 - 模型列表')).toBe('模型列表');
  });

  it('keeps non-model API group names unchanged', () => {
    expect(getApiGroupDisplayName('管理接口 - 日志')).toBe('管理接口 - 日志');
  });
});

describe('getLocalizedApiPageTree', () => {
  it('renames generated OpenAPI separator groups in the sidebar tree', () => {
    const tree: Root = {
      type: 'root',
      name: '',
      children: [
        { type: 'separator', name: 'AI 模型 - 聊天' },
        {
          type: 'page',
          name: 'Create chat completion',
          url: '/docs/api-reference/ai-%E6%A8%A1%E5%9E%8B---%E8%81%8A%E5%A4%A9/createChatCompletion',
        },
        { type: 'separator', name: 'A I 模型 图像' },
        {
          type: 'page',
          name: 'Create image',
          url: '/docs/api-reference/ai-%E6%A8%A1%E5%9E%8B---%E5%9B%BE%E5%83%8F/createImageGeneration',
        },
      ],
    };

    expect(getLocalizedApiPageTree(tree, 'zh')).toMatchObject({
      children: [
        { type: 'separator', name: '聊天' },
        {
          type: 'page',
          url: '/zh/docs/api-reference/ai-%E6%A8%A1%E5%9E%8B---%E8%81%8A%E5%A4%A9/createChatCompletion',
        },
        { type: 'separator', name: '图片' },
        {
          type: 'page',
          url: '/zh/docs/api-reference/ai-%E6%A8%A1%E5%9E%8B---%E5%9B%BE%E5%83%8F/createImageGeneration',
        },
      ],
    });
  });
});
