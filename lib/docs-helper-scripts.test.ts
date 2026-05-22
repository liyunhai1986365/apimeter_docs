import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();
const docsDir = path.join(repoRoot, 'content/docs');

function listTextFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    if (statSync(fullPath).isDirectory()) return listTextFiles(fullPath);
    return /\.(mdx|md|json|ya?ml)$/.test(fullPath) ? [fullPath] : [];
  });
}

describe('docs helper scripts', () => {
  it('uses ModelSell static install scripts instead of EasyRouter helper scripts', () => {
    const contents = listTextFiles(docsDir)
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');

    expect(contents).not.toContain('docs.easyrouter.io/helper');
    expect(contents).not.toContain('docs.easyrouter.io/en/helper');
    expect(contents).toContain(
      'curl -fsSL https://static.modelsell.com/modelsell-cli/install.sh | sh',
    );
    expect(contents).toContain(
      'powershell -ExecutionPolicy Bypass -c "irm https://static.modelsell.com/modelsell-cli/install.ps1 | iex"',
    );
  });
});
