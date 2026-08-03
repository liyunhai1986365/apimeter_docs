import Link from 'next/link';
import { headers } from 'next/headers';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Cpu,
  FilePenLine,
  Settings2,
  Sparkles,
  TerminalSquare,
  Zap,
} from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { brandText, getDocsBrandFromHeaders } from '@/lib/docs-brand';

const targets = ['Claude Code', 'Codex CLI', 'Gemini CLI', 'OpenClaw'];

const setupPaths = [
  {
    title: 'CC Switch 接入文档',
    description:
      '通过 CC Switch 配置 Codex、Gemini CLI、OpenClaw 和 Hermes 等工具。',
    icon: Settings2,
    action: '查看 CC Switch 文档',
    href: '/zh/docs/apps/cc-switch-setup',
  },
  {
    title: '手动配置入口',
    description:
      '如果你的工具不在自动配置列表里，只要它支持自定义 API Key、Base URL 和模型名，就可以按通用参数接入。',
    icon: FilePenLine,
    action: '浏览全部手动接入文档',
    href: '/zh/docs/apps',
  },
];

const docs = [
  {
    href: '/zh/docs/apps/aionui',
    title: 'AionUi',
    description: '免费开源桌面办公 Agent，支持多模型、文件管理和实时预览。',
    icon: Sparkles,
  },
  {
    href: '/zh/docs/apps/cursor',
    title: 'Cursor',
    description: 'AI 原生代码编辑器，可通过自定义 Base URL 接入模型服务。',
    icon: Cpu,
  },
  {
    href: '/zh/docs/apps/cc-switch',
    title: 'CC Switch',
    description: '一键管理 Claude、Codex、Gemini CLI 的 Provider、MCP 与提示词配置。',
    icon: Settings2,
  },
  {
    href: '/zh/docs/apps/opencode',
    title: 'OpenCode',
    description: '开源终端 AI 编程智能体，兼容多种模型服务供应商。',
    icon: TerminalSquare,
  },
  {
    href: '/zh/docs/apps/crush',
    title: 'Crush',
    description: 'Charm 开发的开源终端 AI 编码智能体，拥有响应式 TUI。',
    icon: Zap,
  },
  {
    href: '/zh/docs/apps/hermes-agent',
    title: 'Hermes Agent',
    description: 'Nous Research 出品的开源终端 AI Agent，可通过 Custom Endpoint 接入。',
    icon: Bot,
  },
];

export default async function HomePage() {
  const requestHeaders = await headers();
  const brand = getDocsBrandFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'localhost:3030'}/`,
  );
  const t = (text: string) => brandText(text, brand);

  return (
    <main className="min-h-screen bg-fd-background text-fd-foreground">
      <SiteHeader publicOrigin={brand.publicOrigin} />
      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12 lg:px-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border bg-fd-card px-3 py-1 text-sm text-fd-muted-foreground">
            <TerminalSquare className="size-4 text-fd-primary" />
            Agent 工具
          </div>

          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight md:text-7xl">
            Agent 工具接入
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-fd-muted-foreground">
            {t(
              '查看 Claude Code、Codex CLI、Gemini CLI、OpenClaw、Cursor、Cherry Studio 等客户端接入指南。',
            )}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/zh/docs/apps/cc-switch-setup"
              className="inline-flex items-center gap-2 rounded-md bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition hover:opacity-90"
            >
              查看 CC Switch 文档
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/zh/docs/api-reference"
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition hover:bg-fd-accent"
            >
              查看 API Reference
              <Sparkles className="size-4" />
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {targets.map((target) => (
              <span
                key={target}
                className="inline-flex items-center gap-1.5 rounded-full border bg-fd-card px-3 py-1 text-sm text-fd-muted-foreground"
              >
                <CheckCircle2 className="size-3.5 text-fd-primary" />
                {target}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-fd-card/20 px-6 py-16 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase text-fd-muted-foreground">
              接入方式
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              按工具选择接入方式
            </h2>
            <p className="mt-4 text-sm leading-6 text-fd-muted-foreground">
              {t(
                '选择对应工具的接入指南。如果工具支持 OpenAI 兼容接口，可以用同一套 ModelSell 参数手动接入。',
              )}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {setupPaths.map((path) => {
              const Icon = path.icon;

              return (
                <Link
                  key={path.href}
                  href={path.href}
                  className="group rounded-md border bg-fd-background/80 p-5 transition hover:bg-fd-accent/60"
                >
                  <div className="flex items-center justify-between gap-4">
                    <Icon className="size-5 text-fd-primary" />
                    <ArrowRight className="size-4 text-fd-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-fd-primary" />
                  </div>
                  <h3 className="mt-6 text-base font-semibold">{t(path.title)}</h3>
                  <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                    {t(path.description)}
                  </p>
                  <p className="mt-4 text-sm font-medium text-fd-primary">
                    {path.action}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium uppercase text-fd-muted-foreground">
                推荐文档
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                更多 Agent 配置入口
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-fd-muted-foreground">
                {t(
                  '当前文档已经整理了更多 Agent 和客户端配置方式；如果你的工具支持自定义 API Key 和 Base URL，通常也能按 OpenAI 兼容参数接入 ModelSell。',
                )}
              </p>
            </div>
            <Link
              href="/zh/docs/apps"
              className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary"
            >
              查看全部 Agent 文档
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {docs.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-lg border bg-fd-card p-5 transition hover:-translate-y-0.5 hover:bg-fd-accent/60"
                >
                  <Icon className="mb-8 size-5 text-fd-primary" />
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    {item.title}
                    <ArrowRight className="size-4 opacity-0 transition group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-md border bg-fd-card/50 p-4 text-sm leading-6 text-fd-muted-foreground">
            <Code2 className="mt-0.5 size-4 shrink-0 text-fd-primary" />
            <p>
              {t(
                '通用接入信息通常只有三项：ModelSell API Key、Base URL 和模型名称。无法自动配置的 Agent，可在对应工具的 Provider、模型或 OpenAI Compatible 设置里手动填写。',
              )}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
