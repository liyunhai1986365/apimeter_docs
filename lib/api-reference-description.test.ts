import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const apiReferenceRouteFiles = [
  'app/docs/api-reference/[[...slug]]/page.tsx',
  'app/[lang]/docs/api-reference/[[...slug]]/page.tsx',
];

describe('API reference operation descriptions', () => {
  it('lets APIPage render operation descriptions only once', () => {
    for (const filePath of apiReferenceRouteFiles) {
      const source = readFileSync(resolve(process.cwd(), filePath), 'utf8');
      const pageRenderSource = source.split('export function generateStaticParams()')[0];

      expect(pageRenderSource).not.toContain('DocsDescription');
      expect(pageRenderSource).not.toContain('page.data.description');
    }
  });

  it('does not duplicate operation descriptions in embedded playgrounds', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'components/api-playground-embed.tsx'),
      'utf8',
    );

    expect(source).not.toContain('page.data.description');
  });
});
