import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();
const zhAppsDir = path.join(repoRoot, 'content/docs/zh/apps');
const enAppsDir = path.join(repoRoot, 'content/docs/en/apps');

describe('agent apps documentation navigation', () => {
  it('uses the original CLI route for the CC Switch integration page', () => {
    const meta = JSON.parse(
      readFileSync(path.join(zhAppsDir, 'meta.json'), 'utf8'),
    ) as { pages: string[] };
    const appsIndex = readFileSync(
      path.join(repoRoot, 'content/docs/zh/apps.mdx'),
      'utf8',
    );
    const page = readFileSync(path.join(zhAppsDir, 'cc-switch-setup.mdx'), 'utf8');

    expect(meta.pages[0]).toBe('cc-switch-setup');
    expect(page).toContain('title: CC Switch 接入文档');
    expect(appsIndex).toContain('/zh/docs/apps/cc-switch-setup');
  });

  it('links every app card to an existing agent detail page', () => {
    const appsIndex = readFileSync(
      path.join(repoRoot, 'content/docs/zh/apps.mdx'),
      'utf8',
    );
    const links = [...appsIndex.matchAll(/href="\/zh\/docs\/apps\/([^"]+)"/g)].map(
      ([, slug]) => slug,
    );

    expect(links.length).toBeGreaterThan(0);
    for (const slug of links) {
      expect(existsSync(path.join(zhAppsDir, `${slug}.mdx`))).toBe(true);
    }
  });

  it('adds the CC Switch setup page to English docs navigation', () => {
    const meta = JSON.parse(
      readFileSync(path.join(enAppsDir, 'meta.json'), 'utf8'),
    ) as { pages: string[] };
    const docsMeta = JSON.parse(
      readFileSync(path.join(repoRoot, 'content/docs/en/meta.json'), 'utf8'),
    ) as { pages: string[] };
    const appsIndex = readFileSync(
      path.join(repoRoot, 'content/docs/en/apps.mdx'),
      'utf8',
    );
    const page = readFileSync(path.join(enAppsDir, 'cc-switch-setup.mdx'), 'utf8');

    expect(docsMeta.pages).toContain('apps');
    expect(meta.pages[0]).toBe('cc-switch-setup');
    expect(page).toContain('title: CC Switch Setup');
    expect(appsIndex).toContain('/docs/apps/cc-switch-setup');
  });
});
