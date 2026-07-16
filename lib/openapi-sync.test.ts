import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { openapi } from '@/lib/openapi';

const proxyRoutePath = resolve(process.cwd(), 'app/api/proxy/route.ts');
const docsProxyRoutePath = resolve(process.cwd(), 'app/docs/api/proxy/route.ts');
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
      'operationId: createEmbedding',
      '/v1/images/generations:',
      '/v1/tasks/{id}:',
      '/v1/images/edits:',
      '/mj/submit/imagine:',
      '/mj/submit/edits:',
      '/mj/submit/video:',
      '/mj/task/{task_id}/fetch:',
      '/mj/task/list-by-condition:',
      '/mj/insight-face/swap:',
      '/mj/submit/action:',
      '/mj/submit/modal:',
      '/suno/submit/music:',
      '/suno/submit/lyrics:',
      '/suno/fetch/{task_id}:',
      '/suno/fetch:',
      '/suno/feed/{clip_id}:',
      '/suno/act/wav/{clip_id}:',
      '/suno/act/timing/{clip_id}:',
      '/v1/video/generations:',
      '/v1/video/generations/{task_id}:',
      '/v1/videos:',
      '/v1/videos/{task_id}:',
      '/v1/videos/{task_id}/content:',
      'operationId: createOpenAIVideo',
      'operationId: getOpenAIVideo',
      'grok-imagine-video',
      'grok-imagine-video-1.5-preview',
      '/api/v3/contents/generations/tasks:',
      '/api/v3/contents/generations/tasks/{task_id}:',
      '/api/assets/upload:',
      '/api/assets/{id}:',
      'operationId: createSeedance2VideoTask',
      'operationId: getSeedance2VideoTask',
      'operationId: uploadSeedanceAsset',
      'operationId: getSeedanceAsset',
      'Seedance 2.0 时，通用字段会转换为官方 `content[]` 格式',
      '/api/log/self/stat:',
      '/api/log/token:',
      '/api/token/{id}:',
      '/api/usage/token/:',
      '/api/resource-channel/byteplus/visual-validate/sessions:',
      '/api/resource-channel/byteplus/visual-validate/assets:',
      'newApiUser:',
    ];

    for (const snippet of requiredSnippets) {
      expect(openApiText).toContain(snippet);
    }
  });

  it('keeps API server configuration proxy-domain friendly', () => {
    expect(openApiText).toContain('url: /');
    expect(openApiText).not.toContain('https://easyrouter.io');
    expect(openApiText).not.toContain('https://api.modelsell.test');
  });

  it('keeps the API playground proxy route available', () => {
    expect(existsSync(proxyRoutePath)).toBe(true);
  });

  it('uses a docs-scoped API playground proxy path', () => {
    expect(existsSync(docsProxyRoutePath)).toBe(true);
    expect(openapi.options.proxyUrl).toBe('/docs/api/proxy');
  });

  it('uses the Chinese API document categories for generated reference groups', () => {
    const requiredCategories = [
      'name: 账户管理',
      'name: 聊天系列',
      'name: AI 模型 - 嵌入',
      'name: 图片系列',
      'name: 视频系列',
      'name: 管理接口 - 鉴权',
      'name: 管理接口 - 日志',
      'name: 管理接口 - 令牌管理',
      'name: 管理接口 - 真人认证',
      'summary: Claude 格式',
      'summary: ChatCompletions 格式',
      'summary: 查询图片异步任务',
      'summary: 查询视频任务',
      'summary: Seedance 2.0 视频生成',
      'summary: 创建真人认证会话',
    ];

    for (const category of requiredCategories) {
      expect(openApiText).toContain(category);
    }

    expect(openApiText).not.toContain('AI 模型 - 图像');
    expect(openApiText).not.toContain('AI 模型 - 视频');
    expect(openApiText).not.toContain('AI 模型 - 模型列表');
    expect(openApiText).not.toContain('AI 模型 - 补全');
  });

  it('documents async image submission and polling consistently', () => {
    const requiredSnippets = [
      'OpenAI Images API 兼容的图像生成接口。默认同步返回图片结果；如需异步提交',
      'OpenAI Images API 兼容的图像编辑接口。默认同步返回编辑后的图片结果；如需异步提交',
      "- $ref: '#/components/parameters/ImageAsync'",
      'ImageAsync:',
      'ImageAsyncSubmitResponse:',
      '仅适用于在 `/v1/images/generations?async=true` 或 `/v1/images/edits?async=true` 提交后返回的图片任务 ID。',
      '当任务为 `succeeded` 且 `data.images` 非空时读取图片结果',
    ];

    for (const snippet of requiredSnippets) {
      expect(openApiText).toContain(snippet);
    }

    expect(openApiText.match(/是否异步提交图片生成或编辑任务/g) ?? []).toHaveLength(0);
    expect(openApiText.match(/`\\?async=true` 时返回图片任务 ID/g) ?? []).toHaveLength(0);
  });

  it('documents Gemini native image generation with official generateContent fields', () => {
    const requiredSnippets = [
      'operationId: generateGeminiImageContent',
      'summary: Gemini 原生图像生成',
      'Gemini 官方 `generateContent` REST 格式的图像生成接口',
      'responseModalities:',
      '- IMAGE',
      'imageConfig:',
      'aspectRatio: 16:9',
      'imageSize: 2K',
      'inlineData:',
      'mimeType: image/png',
      'format: byte',
      '不带 Data URL 前缀的 Base64 媒体数据。',
      '空列表等价于只请求文本。',
    ];

    for (const snippet of requiredSnippets) {
      expect(openApiText).toContain(snippet);
    }
  });

  it('documents Midjourney image task APIs under the image category', () => {
    const requiredSnippets = [
      'summary: Midjourney 提交绘图',
      'summary: Midjourney 图片编辑',
      'summary: Midjourney 视频生成',
      'summary: Midjourney 查询任务',
      'summary: Midjourney 批量查询任务',
      'summary: Midjourney 换脸任务',
      'summary: Midjourney 提交动作',
      'summary: Midjourney 局部重绘',
      'operationId: createMidjourneyImagine',
      'operationId: editMidjourneyImage',
      'operationId: createMidjourneyVideo',
      'operationId: getMidjourneyTask',
      'operationId: listMidjourneyTasksByCondition',
      'operationId: createMidjourneyFaceSwap',
      'operationId: submitMidjourneyAction',
      'operationId: submitMidjourneyModal',
      'description: Midjourney 任务 ID。',
      'description: Midjourney 动作 ID，例如放大、变幻、重绘或局部重绘前置动作返回的 customId。',
      'description: 图片 Base64 Data URL 数组，用于垫图或参考图。',
      'description: 局部重绘遮罩图的 Base64 Data URL。',
      'description: 源人脸图片 Base64 Data URL。',
      'description: 目标图片 Base64 Data URL。',
    ];

    for (const snippet of requiredSnippets) {
      expect(openApiText).toContain(snippet);
    }
  });

  it('documents Suno music task APIs under the audio category', () => {
    const requiredSnippets = [
      'summary: Suno 生成音乐',
      'summary: Suno 生成歌词',
      'summary: Suno 查询音乐任务',
      'summary: Suno 批量查询任务',
      'summary: Suno 批量查询歌曲',
      'summary: Suno 获取 WAV',
      'summary: Suno 歌词时间线',
      'operationId: createSunoMusic',
      'operationId: createSunoLyrics',
      'operationId: getSunoTask',
      'operationId: listSunoTasks',
      'operationId: getSunoFeed',
      'operationId: getSunoWav',
      'operationId: getSunoTiming',
      'Suno 灵感模式',
      '固定自定义歌词模式',
      '音轨分离',
      '生成音乐接口只提交任务',
      '返回两个 Suno 任务 ID',
      'chirp-v4',
      'chirp-v3-5',
      'chirp-bluejay',
      'chirp-auk',
      'chirp-fenix',
      'Suno 5.5 / 最新版',
      '默认 0 表示灵感模式，1 表示自定义模式',
      '自定义模式最多 3000 字',
      '灵感模式最多 200 字',
      '传入知名艺术家名称可能无法生成',
      '是否纯音乐，传 1 表示生成纯音乐',
      'Webhook 回调 URL',
      '续写时间点',
      '上一段官方 clip_id',
      '排除风格',
      '风格标签最多 120 字',
      'control_sliders',
      'style_weight',
      'weirdness_constraint',
      'audio_weight',
      '歌词、音频时间线',
      'GoAmz 接入地址前缀',
      'SunoAPI 接入地址前缀',
      'description: Suno 任务 ID。',
      'description: Suno 歌曲或音频片段 ID。',
    ];

    for (const snippet of requiredSnippets) {
      expect(openApiText).toContain(snippet);
    }
  });

  it('keeps public docs focused on API usage instead of internal conversion plumbing', () => {
    const forbiddenSnippets = [
      '协议互转',
      '互转说明',
      '兼容边界',
      '配置化图片模型',
      '配置化三方视频',
      '通用格式和三方 native 格式互转',
      'Images 请求如何映射到第三方格式',
    ];

    for (const snippet of forbiddenSnippets) {
      expect(openApiText).not.toContain(snippet);
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
      'description: Seedance 2.0 官方格式的内容数组。',
      'description: 素材公网 URL。素材上传接口只支持 URL，不支持 Base64。',
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

  it('documents Seedance 2.0 usage examples across official and generic video formats', () => {
    const requiredSnippets = [
      'videoToVideo:',
      'imageAudioToVideo:',
      'imageVideoReference:',
      'videoAudioToVideo:',
      'allModalities:',
      'seedance2AllModalities:',
      'audio_url: https://example.com/reference-audio.mp3',
      'video_url: https://example.com/reference-video.mp4',
      'doubao-seedance-2-0-fast-260128',
      'asset://<asset_id>',
      'SeedanceAssetUploadRequest:',
    ];

    for (const snippet of requiredSnippets) {
      expect(openApiText).toContain(snippet);
    }
  });

  it('documents Grok video generation through the OpenAI-compatible video endpoint', () => {
    const requiredSnippets = [
      'Grok 视频生成',
      'grok-imagine-video',
      'grok-imagine-video-1.5-preview',
      'summary: Grok 视频生成（JSON）',
      "seconds: '6'",
      'resolution: 720p',
      "custom_domain: 'true'",
      'reference_images:',
      'url: http://38.145.220.6:9000/preview/reference.png',
      'url: http://38.145.220.6:9000/preview/reference.mp4',
      'video_url:',
    ];

    for (const snippet of requiredSnippets) {
      expect(openApiText).toContain(snippet);
    }

    const openAIVideoPath = openApiText.slice(
      openApiText.indexOf('  /v1/videos:'),
      openApiText.indexOf('  /v1/videos/{task_id}:'),
    );
    expect(openAIVideoPath).not.toContain('multipart/form-data:');
  });
});
