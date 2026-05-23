import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}

describe('docs entry navigation', () => {
  it('removes the old generic onboarding pages from docs navigation', () => {
    const zhMeta = readJson<{ pages: string[] }>(
      path.join(repoRoot, 'content/docs/zh/meta.json'),
    );
    const enMeta = readJson<{ pages: string[] }>(
      path.join(repoRoot, 'content/docs/en/meta.json'),
    );

    for (const page of ['quickstart', 'authentication', 'errors']) {
      expect(zhMeta.pages).not.toContain(page);
      expect(enMeta.pages).not.toContain(page);
      expect(existsSync(path.join(repoRoot, `content/docs/zh/${page}.mdx`))).toBe(
        false,
      );
      expect(existsSync(path.join(repoRoot, `content/docs/en/${page}.mdx`))).toBe(
        false,
      );
    }
  });

  it('removes hand-written API and model docs in favor of API Reference', () => {
    const zhMeta = readJson<{ pages: string[] }>(
      path.join(repoRoot, 'content/docs/zh/meta.json'),
    );
    const enMeta = readJson<{ pages: string[] }>(
      path.join(repoRoot, 'content/docs/en/meta.json'),
    );

    expect(zhMeta.pages).not.toContain('api');
    expect(zhMeta.pages).not.toContain('models');
    expect(enMeta.pages).not.toContain('models');
    expect(existsSync(path.join(repoRoot, 'content/docs/zh/api'))).toBe(false);
    expect(existsSync(path.join(repoRoot, 'content/docs/zh/models'))).toBe(false);
    expect(existsSync(path.join(repoRoot, 'content/docs/en/models'))).toBe(false);
  });

  it('turns the default Chinese docs page into a card-based entry map', () => {
    const content = readFileSync(
      path.join(repoRoot, 'content/docs/zh/index.mdx'),
      'utf8',
    );

    expect(content).toContain('title: 欢迎使用 ModelSell');
    expect(content).toContain('<Cards>');
    expect(content).toContain('href="/zh/docs/apps"');
    expect(content).toContain('href="/zh/docs/api-reference"');
    expect(content).not.toContain('href="/zh/docs/api"');
    expect(content).not.toContain('href="/zh/docs/models');
    expect(content).not.toContain('/zh/docs/quickstart');
    expect(content).not.toContain('/zh/docs/authentication');
    expect(content).not.toContain('/zh/docs/errors');
  });
});
