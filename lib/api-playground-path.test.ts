import { describe, expect, it } from 'vitest';
import { getApiPlaygroundSlugs } from './api-playground-path';

describe('getApiPlaygroundSlugs', () => {
  it('extracts slugs from an API reference href', () => {
    expect(
      getApiPlaygroundSlugs('/api-reference/chat/createChatCompletion'),
    ).toEqual(['chat', 'createChatCompletion']);
  });

  it('extracts slugs from an absolute URL and ignores hash fragments', () => {
    expect(
      getApiPlaygroundSlugs(
        'http://localhost:3000/api-reference/models/listModels#response-body',
      ),
    ).toEqual(['models', 'listModels']);
  });

  it('extracts slugs from a localized API reference href', () => {
    expect(
      getApiPlaygroundSlugs('/zh/api-reference/chat/createChatCompletion'),
    ).toEqual(['chat', 'createChatCompletion']);
  });

  it('rejects non API reference links', () => {
    expect(getApiPlaygroundSlugs('/docs/models/chat-completions')).toBeNull();
  });
});
