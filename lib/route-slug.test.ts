import { describe, expect, it } from 'vitest';
import { decodeRouteSlug } from './route-slug';

describe('decodeRouteSlug', () => {
  it('decodes URL-encoded Chinese API reference groups', () => {
    expect(
      decodeRouteSlug([
        'ai-%E6%A8%A1%E5%9E%8B---%E8%81%8A%E5%A4%A9',
        'createMessage',
      ]),
    ).toEqual(['ai-模型---聊天', 'createMessage']);
  });

  it('splits a catch-all slug when Next provides it as one slash-delimited segment', () => {
    expect(
      decodeRouteSlug(
        'ai-%E6%A8%A1%E5%9E%8B---%E8%81%8A%E5%A4%A9/createMessage',
      ),
    ).toEqual(['ai-模型---聊天', 'createMessage']);
  });

  it('splits a slash-delimited value inside a catch-all slug array', () => {
    expect(
      decodeRouteSlug([
        'ai-%E6%A8%A1%E5%9E%8B---%E8%81%8A%E5%A4%A9/createMessage',
      ]),
    ).toEqual(['ai-模型---聊天', 'createMessage']);
  });

  it('keeps already decoded and malformed segments usable', () => {
    expect(decodeRouteSlug(['ai-模型---聊天', '%E0%A4%A'])).toEqual([
      'ai-模型---聊天',
      '%E0%A4%A',
    ]);
  });
});
