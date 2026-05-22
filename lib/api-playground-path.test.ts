import { describe, expect, it } from 'vitest';
import { getApiPlaygroundSlugs } from './api-playground-path';

describe('getApiPlaygroundSlugs', () => {
  it('extracts slugs from an API reference href', () => {
    expect(
      getApiPlaygroundSlugs(
        '/api-reference/ai-%E6%A8%A1%E5%9E%8B---%E8%81%8A%E5%A4%A9/createChatCompletion',
      ),
    ).toEqual(['ai-模型---聊天', 'createChatCompletion']);
  });

  it('extracts slugs from an absolute URL and ignores hash fragments', () => {
    expect(
      getApiPlaygroundSlugs(
        'http://localhost:3000/api-reference/ai-%E6%A8%A1%E5%9E%8B---%E6%A8%A1%E5%9E%8B%E5%88%97%E8%A1%A8/listModels#response-body',
      ),
    ).toEqual(['ai-模型---模型列表', 'listModels']);
  });

  it('extracts slugs from a localized API reference href', () => {
    expect(
      getApiPlaygroundSlugs(
        '/zh/api-reference/ai-%E6%A8%A1%E5%9E%8B---%E8%81%8A%E5%A4%A9/createChatCompletion',
      ),
    ).toEqual(['ai-模型---聊天', 'createChatCompletion']);
  });

  it('rejects non API reference links', () => {
    expect(getApiPlaygroundSlugs('/docs/models/chat-completions')).toBeNull();
  });
});
