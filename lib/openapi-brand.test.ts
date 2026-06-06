import { describe, expect, it } from 'vitest';
import { brandOpenAPIDocument } from '@/lib/openapi-brand';

describe('OpenAPI brand helpers', () => {
  it('sets the server URL to the current proxy origin', () => {
    const document = {
      info: {
        title: 'ModelSell API',
        description: 'ModelSell API 参考文档',
      },
      servers: [{ url: '/' }],
      paths: {},
    };

    expect(
      brandOpenAPIDocument(document, {
        name: 'aiiqq.com',
        publicOrigin: 'https://aiiqq.com',
      }),
    ).toMatchObject({
      info: {
        title: 'aiiqq.com API',
        description: 'aiiqq.com API 参考文档',
      },
      servers: [
        {
          url: 'https://aiiqq.com',
          description: 'The base URL of your API endpoint.',
        },
      ],
    });
  });

  it('preserves ModelSell CLI names inside OpenAPI text examples', () => {
    const document = {
      info: {
        description: 'ModelSell CLI 连接 ModelSell。',
      },
      paths: {},
    };

    expect(
      brandOpenAPIDocument(document, {
        name: 'aiiqq.com',
        publicOrigin: 'https://aiiqq.com',
      }).info.description,
    ).toBe('ModelSell CLI 连接 aiiqq.com。');
  });
});

