import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();
const zhAppsDir = path.join(repoRoot, 'content/docs/zh/apps');

describe('agent apps documentation navigation', () => {
  it('keeps ModelSell CLI as the first agent tools page', () => {
    const meta = JSON.parse(
      readFileSync(path.join(zhAppsDir, 'meta.json'), 'utf8'),
    ) as { pages: string[] };

    expect(meta.pages[0]).toBe('modelsell-cli');
  });

  it('links from the ModelSell CLI page to existing agent detail pages', () => {
    const content = readFileSync(
      path.join(zhAppsDir, 'modelsell-cli.mdx'),
      'utf8',
    );
    const links = [...content.matchAll(/href="\/zh\/docs\/apps\/([^"]+)"/g)].map(
      ([, slug]) => slug,
    );

    expect(links).toEqual(
      expect.arrayContaining(['claude-code', 'codex-cli', 'gemini-cli', 'openclaw']),
    );

    for (const slug of links) {
      expect(existsSync(path.join(zhAppsDir, `${slug}.mdx`))).toBe(true);
    }
  });

  it('repeats every apps page card on the ModelSell CLI page', () => {
    const appsIndex = readFileSync(
      path.join(repoRoot, 'content/docs/zh/apps.mdx'),
      'utf8',
    );
    const cliPage = readFileSync(
      path.join(zhAppsDir, 'modelsell-cli.mdx'),
      'utf8',
    );

    const appCards = [
      ...appsIndex.matchAll(/<Card title="([^"]+)" href="\/zh\/docs\/apps\/([^"]+)">/g),
    ].map(([, title, slug]) => ({ title, slug }));
    const cliCards = [
      ...cliPage.matchAll(/<Card title="([^"]+)" href="\/zh\/docs\/apps\/([^"]+)">/g),
    ].map(([, title, slug]) => ({ title, slug }));

    expect(cliCards).toEqual(appCards);
  });
});
