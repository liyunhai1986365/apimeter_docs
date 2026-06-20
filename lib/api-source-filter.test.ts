import { describe, expect, it } from 'vitest';
import { withoutHiddenApiReferencePages } from '@/lib/api-source-filter';

describe('withoutHiddenApiReferencePages', () => {
  it('removes unpublished chat API reference page files', () => {
    const source = withoutHiddenApiReferencePages({
      files: [
        { type: 'page', path: '/聊天系列/createChatCompletion.mdx', data: {} },
        { type: 'page', path: '/聊天系列/createCompletion.mdx', data: {} },
        { type: 'page', path: '/聊天系列/compactResponse.mdx', data: {} },
      ],
    });

    expect(source.files.map((file) => file.path)).toEqual([
      '/聊天系列/createChatCompletion.mdx',
    ]);
  });

  it('removes unpublished chat API reference slugs from generated metadata', () => {
    const source = withoutHiddenApiReferencePages({
      files: [
        {
          type: 'meta',
          path: '聊天系列/meta.json',
          data: {
            pages: [
              'createChatCompletion',
              'createCompletion',
              'createResponse',
              'compactResponse',
            ],
          },
        },
      ],
    });

    expect(source.files[0].data).toEqual({
      pages: ['createChatCompletion', 'createResponse'],
    });
  });
});
