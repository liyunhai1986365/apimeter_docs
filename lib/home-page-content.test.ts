import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const homePage = readFileSync(
  path.join(process.cwd(), 'app/(home)/page.tsx'),
  'utf8',
);

describe('root home page', () => {
  it('positions ModelSell CLI as the primary entry', () => {
    expect(homePage).toContain('ModelSell CLI');
    expect(homePage).toContain('一键配置主流 Agent 平台');
    expect(homePage).toContain('InstallCommandSwitcher');
    expect(homePage).toContain('/zh/docs/apps/modelsell-cli');
    expect(homePage).toContain('/zh/docs/apps');
  });

  it('presents automatic and manual configuration paths', () => {
    expect(homePage).toContain('自动配置优先，手动配置也随时可用');
    expect(homePage).toContain('推荐先用 ModelSell CLI');
    expect(homePage).toContain('手动配置入口');
    expect(homePage).toContain('如果你的工具支持自定义 API Key 和 Base URL');
    expect(homePage).not.toContain('配置流程');
    expect(homePage).not.toContain('安装后，配置流程自己往下走');
  });

  it('recommends other documented agent configuration guides', () => {
    expect(homePage).toContain('更多 Agent 配置入口');
    expect(homePage).toContain('/zh/docs/apps/aionui');
    expect(homePage).toContain('/zh/docs/apps/cursor');
    expect(homePage).toContain('/zh/docs/apps/cc-switch');
    expect(homePage).toContain('/zh/docs/apps/opencode');
    expect(homePage).toContain('/zh/docs/apps/crush');
    expect(homePage).toContain('/zh/docs/apps/hermes-agent');
    expect(homePage).not.toContain('四个主流 Agent 工具接入指南');
  });

  it('does not use the old generic docs hero copy', () => {
    expect(homePage).not.toContain('Docs and API playground in one place');
    expect(homePage).not.toContain('Read integration guides');
  });
});
