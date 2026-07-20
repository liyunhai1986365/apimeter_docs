import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  apiReferenceMdxSlugs,
  apiReferenceMdxSlugKey,
  getApiReferenceMdxSlugs,
  getApiReferenceMdxTitle,
} from './api-reference-mdx-pages';

describe('API reference MDX pages', () => {
  it('declares supplemental API reference pages under the API reference route', () => {
    expect(apiReferenceMdxSlugs).toEqual([
      ['image', 'generic-image'],
      ['image', 'seedream-5'],
      ['image', 'gemini-native-image'],
      ['midjourney', 'integration'],
      ['suno', 'integration'],
      ['mimo', 'speech-recognition'],
      ['mimo', 'speech-synthesis'],
      ['seedance-2', 'overview'],
      ['seedance-2', 'assets'],
      ['seedance-2', 'generic-video'],
      ['seedance-2', 'modes'],
      ['seedance-2', 'python-polling'],
      ['kling', 'video-overview'],
      ['kling', 'turbo-tasks'],
      ['kling', 'text-to-video'],
      ['kling', 'image-to-video'],
      ['kling', 'omni-video'],
      ['kling', 'motion-control'],
      ['kling', 'multi-image-to-video'],
      ['kling', 'multi-elements'],
      ['kling', 'video-extension'],
      ['kling', 'lip-sync'],
      ['kling', 'avatar'],
      ['kling', 'audio-generation'],
      ['kling', 'elements-voices'],
      ['kling', 'image-recognition'],
      ['grok', 'video-generation'],
      ['happyhorse', 'video-generation'],
      ['omni', 'overview'],
      ['omni', 'omni-fast'],
      ['omni', 'omni-fast-v2v'],
    ]);
    expect(apiReferenceMdxSlugKey(['image', 'generic-image'])).toBe('image/generic-image');
    expect(getApiReferenceMdxTitle(['image', 'generic-image'], 'zh')).toBe('通用图片生成');
    expect(apiReferenceMdxSlugKey(['image', 'seedream-5'])).toBe('image/seedream-5');
    expect(getApiReferenceMdxTitle(['image', 'seedream-5'], 'zh')).toBe('Seedream 5.0 图片生成');
    expect(apiReferenceMdxSlugKey(['image', 'gemini-native-image'])).toBe('image/gemini-native-image');
    expect(getApiReferenceMdxTitle(['image', 'gemini-native-image'], 'zh')).toBe('Gemini 原生图像生成');
    expect(apiReferenceMdxSlugKey(['seedance-2', 'overview'])).toBe('seedance-2/overview');
    expect(getApiReferenceMdxTitle(['seedance-2', 'modes'], 'zh')).toBe('生成模式示例');
    expect(getApiReferenceMdxTitle(['kling', 'video-overview'], 'zh')).toBe('可灵视频接口概览');
    expect(getApiReferenceMdxTitle(['kling', 'turbo-tasks'], 'zh')).toBe('Kling 3.0 Turbo 任务接口');
    expect(getApiReferenceMdxTitle(['grok', 'video-generation'], 'zh')).toBe('Grok 视频生成');
    expect(getApiReferenceMdxTitle(['happyhorse', 'video-generation'], 'zh')).toBe('HappyHorse 视频对接');
    expect(getApiReferenceMdxTitle(['omni', 'overview'], 'zh')).toBe('Omni 视频模型概览');
    expect(getApiReferenceMdxTitle(['midjourney', 'integration'], 'zh')).toBe('对接说明');
    expect(getApiReferenceMdxTitle(['suno', 'integration'], 'en')).toBe('Integration Guide');
    expect(getApiReferenceMdxTitle(['mimo', 'speech-recognition'], 'zh')).toBe('MiMo 语音识别');
    expect(getApiReferenceMdxTitle(['mimo', 'speech-synthesis'], 'en')).toBe('MiMo Speech Synthesis');
  });

  it('documents MiMo ASR and TTS through Chat Completions', () => {
    const speechRecognition = readFileSync(
      resolve(process.cwd(), 'content/docs/zh/api-reference/mimo/speech-recognition.mdx'),
      'utf8',
    );
    const speechSynthesis = readFileSync(
      resolve(process.cwd(), 'content/docs/zh/api-reference/mimo/speech-synthesis.mdx'),
      'utf8',
    );

    for (const snippet of [
      '/v1/chat/completions',
      'mimo-v2.5-asr',
      'input_audio',
      'asr_options',
      'data:audio/mpeg;base64',
      'audio_tokens',
    ]) {
      expect(speechRecognition).toContain(snippet);
    }

    for (const snippet of [
      '/v1/chat/completions',
      'mimo-v2.5-tts',
      'mimo-v2.5-tts-voicedesign',
      'mimo-v2.5-tts-voiceclone',
      'optimize_text_preview',
      'message.audio.data',
      'pcm16',
    ]) {
      expect(speechSynthesis).toContain(snippet);
    }
  });

  it('documents HappyHorse generic and native video task integrations', () => {
    const happyHorse = readFileSync(
      resolve(process.cwd(), 'content/docs/zh/api-reference/happyhorse/video-generation.mdx'),
      'utf8',
    );

    for (const snippet of [
      'happyhorse-1.0-t2v',
      'happyhorse-1.0-i2v',
      'happyhorse-1.0-r2v',
      'happyhorse-1.0-video-edit',
      '/v1/video/generations',
      '/api/v1/services/aigc/video-generation/video-synthesis',
      '/api/v1/tasks/{task_id}',
      'first_frame',
      'reference_image',
      'metadata.video_url',
      'output.video_url',
    ]) {
      expect(happyHorse).toContain(snippet);
    }
  });

  it('keeps supplemental API reference page files in sync with the declared slugs', () => {
    for (const slug of getApiReferenceMdxSlugs('zh')) {
      const zhContent = readFileSync(
        resolve(process.cwd(), 'content/docs/zh/api-reference', ...slug) + '.mdx',
        'utf8',
      );

      expect(zhContent).toContain('title:');
    }

    for (const slug of getApiReferenceMdxSlugs('en')) {
      const enContent = readFileSync(
        resolve(process.cwd(), 'content/docs/en/api-reference', ...slug) + '.mdx',
        'utf8',
      );

      expect(enContent).toContain('title:');
    }
  });

  it('documents distinct Kling 3.0 Turbo text-to-video and image-to-video request shapes', () => {
    const turboTasks = readFileSync(
      resolve(process.cwd(), 'content/docs/zh/api-reference/kling/turbo-tasks.mdx'),
      'utf8',
    );

    for (const snippet of [
      '/kling/text-to-video/kling-3.0-turbo',
      '/kling/image-to-video/kling-3.0-turbo',
      '"prompt":',
      '"contents":',
      '"type": "first_frame"',
      '"options":',
      '"watermark_info":',
      '"external_task_id":',
      '"settings":',
      '"aspect_ratio": "9:16"',
    ]) {
      expect(turboTasks).toContain(snippet);
    }
  });

  it('documents Midjourney and Suno integration guides with runnable examples', () => {
    const midjourney = readFileSync(
      resolve(process.cwd(), 'content/docs/zh/api-reference/midjourney/integration.mdx'),
      'utf8',
    );
    const suno = readFileSync(
      resolve(process.cwd(), 'content/docs/zh/api-reference/suno/integration.mdx'),
      'utf8',
    );

    for (const snippet of [
      '/mj/submit/imagine',
      'mj-fast/mj/submit/imagine',
      '/mj/task/{task_id}/fetch',
      'botType',
      'base64Array',
      'notifyHook',
      'U/V/Reroll',
    ]) {
      expect(midjourney).toContain(snippet);
    }

    for (const snippet of [
      '/suno/submit/music',
      '/suno/fetch/{task_id}',
      'GoAmz',
      'SunoAPI',
      'chirp-v4',
      'custom_mode',
      'make_instrumental',
      'callback_url',
    ]) {
      expect(suno).toContain(snippet);
    }
  });

  it('documents the generic image protocol without provider-profile details', () => {
    const genericImage = readFileSync(
      resolve(process.cwd(), 'content/docs/zh/api-reference/image/generic-image.mdx'),
      'utf8',
    );

    for (const snippet of [
      '/v1/images/generations',
      '/v1/images/edits',
      '支持模型',
      'nano-banana',
      'nano-banana-2',
      'nano-banana-2-lite',
      'nanp-banana-pro',
      'gpt-image-2',
      '按模型区分参数',
      'aspect_ratio',
      'resolution',
      'size',
      '1024x1024',
      '1536x1024',
      'enable_web_search',
    ]) {
      expect(genericImage).toContain(snippet);
    }

    for (const removedSnippet of [
      'WaveSpeed 与 Duomi 映射',
      '当前内置图片 Profile',
      '通用视频接口与模型',
      'duomi-gemini-image',
      'wavespeed-nano-banana-pro',
      '/v1/video/generations',
    ]) {
      expect(genericImage).not.toContain(removedSnippet);
    }
  });

  it('documents the Gemini native image protocol with official generateContent fields', () => {
    const geminiNativeImage = readFileSync(
      resolve(process.cwd(), 'content/docs/zh/api-reference/image/gemini-native-image.mdx'),
      'utf8',
    );

    for (const snippet of [
      '/v1beta/models/{model}:generateContent',
      '/v1/models/{model}:generateContent',
      'contents[].parts[]',
      'inlineData',
      'mimeType',
      'generationConfig.responseModalities',
      'imageConfig',
      'candidates[].content.parts[].inlineData.data',
      'response_format',
      'interactions',
    ]) {
      expect(geminiNativeImage).toContain(snippet);
    }
  });

  it('documents every supported Seedream 5.0 request mode and parameter', () => {
    const seedream = readFileSync(
      resolve(process.cwd(), 'content/docs/zh/api-reference/image/seedream-5.mdx'),
      'utf8',
    );

    for (const snippet of [
      'doubao-seedream-5-0-pro-260628',
      'doubao-seedream-5-0-260128',
      'doubao-seedream-5-0-lite-260128',
      '文生图',
      '单参考图生图',
      '多参考图生图',
      '文生组图',
      '单参考图生组图',
      '多参考图生组图',
      '交互编辑',
      '联网搜索',
      '流式输出',
      'Base64 返回',
      'optimize_prompt_options',
      'sequential_image_generation_options',
      'max_images',
      'response_format',
      'output_format',
      'watermark',
      'tools',
      'stream',
    ]) {
      expect(seedream).toContain(snippet);
    }
  });
});
