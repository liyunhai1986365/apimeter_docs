import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const openApiText = readFileSync(
  resolve(process.cwd(), 'content/openapi/modelsell.yaml'),
  'utf8',
);

describe('modelsell OpenAPI sync', () => {
  it('documents all EasyRouter API families in the generated API reference', () => {
    const requiredSnippets = [
      '/v1/chat/completions:',
      'operationId: createMessage',
      '/v1beta/models/{model}:generateContent:',
      'operationId: createResponse',
      'operationId: createCompletion',
      'operationId: createEmbedding',
      '/v1/images/generations:',
      '/v1/images/edits:',
      '/v1/video/generations:',
      '/v1/video/generations/{task_id}:',
      '/v1/videos:',
      '/v1/videos/{task_id}:',
      '/v1/videos/{task_id}/content:',
      '/api/log/self/stat:',
      '/api/log/token:',
      '/api/token/{id}:',
      '/api/usage/token/:',
      '/api/user/self:',
      '/api/resource-channel/byteplus/visual-validate/sessions:',
      '/api/resource-channel/byteplus/visual-validate/assets:',
      'newApiUser:',
    ];

    for (const snippet of requiredSnippets) {
      expect(openApiText).toContain(snippet);
    }
  });

  it('keeps ModelSell host names in examples and server configuration', () => {
    expect(openApiText).toContain('url: https://modelsell.com');
    expect(openApiText).not.toContain('https://easyrouter.io');
    expect(openApiText).not.toContain('https://api.modelsell.test');
  });

  it('uses the Chinese API document categories for generated reference groups', () => {
    const requiredCategories = [
      'name: AI 模型 - 聊天',
      'name: AI 模型 - 补全',
      'name: AI 模型 - 嵌入',
      'name: AI 模型 - 图像',
      'name: AI 模型 - 模型列表',
      'name: AI 模型 - 视频',
      'name: 管理接口 - 鉴权',
      'name: 管理接口 - 日志',
      'name: 管理接口 - 令牌管理',
      'name: 管理接口 - 用户管理',
      'name: 管理接口 - 真人认证',
      'summary: Claude 格式',
      'summary: ChatCompletions 格式',
      'summary: 创建真人认证会话',
    ];

    for (const category of requiredCategories) {
      expect(openApiText).toContain(category);
    }
  });

  it('provides Chinese field descriptions for API playground schemas', () => {
    const requiredFieldDescriptions = [
      'description: 要调用的模型 ID。',
      'description: 按顺序排列的对话消息列表。',
      'description: 生成回复时允许输出的最大 token 数。',
      'description: 采样温度，数值越高输出越随机。',
      'description: Responses API 的输入内容，可以是字符串或消息对象数组。',
      'description: 用于生成向量的输入文本，部分模型支持字符串数组。',
      'description: 生成或编辑图像时使用的文本提示词。',
      'description: 视频生成提示词，描述希望生成的视频内容。',
      'description: API 令牌名称。',
      'description: 令牌剩余额度，支持时可用 -1 表示不限额。',
      'description: 认证完成后跳转的公网可访问 URL。',
      'description: 人像素材文件。',
      'description: 接口返回的业务数据，结构随接口不同而变化。',
    ];

    for (const description of requiredFieldDescriptions) {
      expect(openApiText).toContain(description);
    }
  });
});
