import { describe, expect, it } from 'vitest';
import { createElement, isValidElement } from 'react';
import { brandPageTree, getBrandedPageTree } from '@/lib/page-tree-brand';

describe('page tree brand helper', () => {
  it('replaces ModelSell in nested page tree labels', () => {
    const tree = {
      name: 'Docs',
      children: [
        {
          name: '欢迎使用 ModelSell',
          description: '已支持对接 ModelSell 的工具。',
        },
        {
          name: 'ModelSell CLI',
          description: '使用 ModelSell CLI 自动配置。',
        },
      ],
    };

    expect(
      brandPageTree(tree, {
        name: 'aiiqq.com',
        publicOrigin: 'https://aiiqq.com',
      }),
    ).toEqual({
      name: 'Docs',
      children: [
        {
          name: '欢迎使用 aiiqq.com',
          description: '已支持对接 aiiqq.com 的工具。',
        },
        {
          name: 'aiiqq.com CLI',
          description: '使用 aiiqq.com CLI 自动配置。',
        },
      ],
    });
  });

  it('preserves React elements in the page tree', () => {
    function Icon() {
      return null;
    }

    const icon = createElement(Icon);
    const brandedTree = brandPageTree(
      {
        name: '欢迎使用 ModelSell',
        icon,
      },
      {
        name: 'aiiqq.com',
        publicOrigin: 'https://aiiqq.com',
      },
    );

    expect(brandedTree.name).toBe('欢迎使用 aiiqq.com');
    expect(brandedTree.icon).toBe(icon);
    expect(isValidElement(brandedTree.icon)).toBe(true);
  });

  it('hides the agent apps docs branch for proxy domains', () => {
    const tree = {
      type: 'root',
      name: '',
      children: [
        {
          type: 'page',
          name: '欢迎使用 ModelSell',
          url: '/zh/docs',
        },
        {
          type: 'folder',
          name: 'Agent 工具',
          url: '/zh/docs/apps',
          children: [
            {
              type: 'page',
              name: 'AionUi',
              url: '/zh/docs/apps/aionui',
            },
          ],
        },
        {
          type: 'separator',
          name: 'API 参考',
        },
      ],
    };

    expect(
      getBrandedPageTree(tree, {
        name: 'ModelSell',
        publicOrigin: 'https://modelsell.com',
      }),
    ).toMatchObject({
      children: expect.arrayContaining([
        expect.objectContaining({ url: '/zh/docs/apps' }),
      ]),
    });

    expect(
      getBrandedPageTree(tree, {
        name: 'aiiqq.com',
        publicOrigin: 'https://aiiqq.com',
      }),
    ).toEqual({
      type: 'root',
      name: '',
      children: [
        {
          type: 'page',
          name: '欢迎使用 aiiqq.com',
          url: '/zh/docs',
        },
        {
          type: 'separator',
          name: 'API 参考',
        },
      ],
    });

    expect(
      getBrandedPageTree(tree, {
        name: '云心',
        publicOrigin: 'http://127.0.0.1:3030',
      }),
    ).toMatchObject({
      children: expect.arrayContaining([
        expect.objectContaining({
          name: 'Agent 工具',
          url: '/zh/docs/apps',
          children: expect.arrayContaining([
            expect.objectContaining({
              name: 'AionUi',
              url: '/zh/docs/apps/aionui',
            }),
          ]),
        }),
      ]),
    });
  });
});
