import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();
const zhAppsDir = path.join(repoRoot, 'content/docs/zh/apps');
const enAppsDir = path.join(repoRoot, 'content/docs/en/apps');

function listMdxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    if (statSync(fullPath).isDirectory()) return listMdxFiles(fullPath);
    return fullPath.endsWith('.mdx') ? [fullPath] : [];
  });
}

describe('docs app image assets', () => {
  it('uses local public assets for synced app images', () => {
    const files = [
      path.join(repoRoot, 'content/docs/zh/apps.mdx'),
      path.join(repoRoot, 'content/docs/en/apps.mdx'),
      ...listMdxFiles(zhAppsDir),
      ...listMdxFiles(enAppsDir),
    ];

    for (const file of files) {
      const content = readFileSync(file, 'utf8');
      expect(content, file).not.toContain('https://docs.easyrouter.io/assets/');

      const localAssets = content.matchAll(/!\[[^\]]*\]\((\/assets\/docs\/apps\/[^)]+)\)/g);
      for (const [, assetPath] of localAssets) {
        expect(existsSync(path.join(repoRoot, 'public', assetPath))).toBe(true);
      }
    }
  });
});
