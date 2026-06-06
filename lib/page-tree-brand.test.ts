import { describe, expect, it } from 'vitest';
import { createElement, isValidElement } from 'react';
import { brandPageTree } from '@/lib/page-tree-brand';

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
          name: 'ModelSell CLI',
          description: '使用 ModelSell CLI 自动配置。',
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
});
