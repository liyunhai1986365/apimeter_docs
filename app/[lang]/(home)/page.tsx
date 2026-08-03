import Link from 'next/link';
import { headers } from 'next/headers';
import {
  ArrowRight,
  Bot,
  Code2,
  ClipboardCheck,
  Cpu,
  FilePenLine,
  Settings2,
  Sparkles,
  TerminalSquare,
  Zap,
} from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { getLocaleFromParams, getLocalizedHref } from '@/lib/i18n-path';
import { brandText, getDocsBrandFromHeaders } from '@/lib/docs-brand';

const content = {
  en: {
    eyebrow: 'ModelSell Developer Docs',
    title: 'Connect agent tools.',
    description:
      'Browse client and agent integration guides for OpenAI-compatible API key, base URL, and model settings.',
    primary: 'Agent tools',
    secondary: 'API Reference',
    setupLabel: 'Setup paths',
    setupTitle: 'Choose the setup path for each tool.',
    setupDescription:
      'Select the guide for your tool. If it supports custom API key, base URL, and model settings, it can usually connect through OpenAI-compatible configuration.',
    setupPaths: [
      {
        href: '/docs/apps/cc-switch-setup',
        title: 'CC Switch integration',
        description:
          'Configure Codex, Gemini CLI, OpenClaw, and Hermes through CC Switch.',
        action: 'Open CC Switch guide',
        icon: Settings2,
      },
      {
        href: '/docs/apps',
        title: 'Manual setup entry',
        description:
          'If a tool is not in the automatic list, use its custom API key, base URL, and model settings to connect manually.',
        action: 'Browse manual integration guides',
        icon: FilePenLine,
      },
    ],
    docsTitle: 'More agent setup entries',
    docsDescription:
      'The docs also include more agent and client setup guides. If a tool supports a custom API key and base URL, it can usually connect to ModelSell through OpenAI-compatible settings.',
    docsAction: 'View all agent docs',
    genericNote:
      'Most manual integrations need only three values: ModelSell API key, base URL, and model name. Put them into the tool\'s Provider, Model, or OpenAI Compatible settings.',
    docs: [
      {
        href: '/docs/apps/aionui',
        title: 'AionUi',
        description: 'Open-source desktop coworking agent with multi-model support and live preview.',
        icon: Sparkles,
      },
      {
        href: '/docs/apps/cursor',
        title: 'Cursor',
        description: 'AI-native code editor that supports custom base URLs on eligible plans.',
        icon: Cpu,
      },
      {
        href: '/docs/apps/cc-switch',
        title: 'CC Switch',
        description: 'Manage Claude, Codex, and Gemini CLI providers, MCP, prompts, and skills.',
        icon: Settings2,
      },
      {
        href: '/docs/apps/opencode',
        title: 'OpenCode',
        description: 'Open-source terminal coding agent compatible with multiple model providers.',
        icon: TerminalSquare,
      },
      {
        href: '/docs/apps/crush',
        title: 'Crush',
        description: 'Open-source terminal coding agent from Charm with a responsive TUI.',
        icon: Zap,
      },
      {
        href: '/docs/apps/hermes-agent',
        title: 'Hermes Agent',
        description: 'Nous Research terminal AI agent that can connect through custom endpoints.',
        icon: Bot,
      },
    ],
  },
  zh: {
    eyebrow: 'Agent 工具',
    title: 'Agent 工具接入',
    description:
      '查看 Claude Code、Codex CLI、Gemini CLI、OpenClaw、Cursor、Cherry Studio 等客户端接入指南。',
    primary: '浏览 Agent 工具',
    secondary: '查看 API Reference',
    setupLabel: '接入方式',
    setupTitle: '按工具选择接入方式',
    setupDescription:
      '选择对应工具的接入指南。如果工具支持 OpenAI 兼容接口，可以用同一套 ModelSell 参数手动接入。',
    setupPaths: [
      {
        href: '/docs/apps/cc-switch-setup',
        title: 'CC Switch 接入文档',
        description:
          '通过 CC Switch 配置 Codex、Gemini CLI、OpenClaw 和 Hermes 等工具。',
        action: '查看 CC Switch 文档',
        icon: Settings2,
      },
      {
        href: '/docs/apps',
        title: '手动配置入口',
        description:
          '如果你的工具不在自动配置列表里，只要它支持自定义 API Key、Base URL 和模型名，就可以按通用参数接入。',
        action: '浏览全部手动接入文档',
        icon: FilePenLine,
      },
    ],
    docsTitle: '更多 Agent 配置入口',
    docsDescription:
      '当前文档已经整理了更多 Agent 和客户端配置方式；如果你的工具支持自定义 API Key 和 Base URL，通常也能按 OpenAI 兼容参数接入 ModelSell。',
    docsAction: '查看全部 Agent 文档',
    genericNote:
      '通用接入信息通常只有三项：ModelSell API Key、Base URL 和模型名称。无法自动配置的 Agent，可在对应工具的 Provider、模型或 OpenAI Compatible 设置里手动填写。',
    docs: [
      {
        href: '/docs/apps/aionui',
        title: 'AionUi',
        description: '免费开源桌面办公 Agent，支持多模型、文件管理和实时预览。',
        icon: Sparkles,
      },
      {
        href: '/docs/apps/cursor',
        title: 'Cursor',
        description: 'AI 原生代码编辑器，可通过自定义 Base URL 接入模型服务。',
        icon: Cpu,
      },
      {
        href: '/docs/apps/cc-switch',
        title: 'CC Switch',
        description: '一键管理 Claude、Codex、Gemini CLI 的 Provider、MCP 与提示词配置。',
        icon: Settings2,
      },
      {
        href: '/docs/apps/opencode',
        title: 'OpenCode',
        description: '开源终端 AI 编程智能体，兼容多种模型服务供应商。',
        icon: TerminalSquare,
      },
      {
        href: '/docs/apps/crush',
        title: 'Crush',
        description: 'Charm 开发的开源终端 AI 编码智能体，拥有响应式 TUI。',
        icon: Zap,
      },
      {
        href: '/docs/apps/hermes-agent',
        title: 'Hermes Agent',
        description: 'Nous Research 出品的开源终端 AI Agent，可通过 Custom Endpoint 接入。',
        icon: Bot,
      },
    ],
  },
};

export default async function LocalizedHomePage(props: {
  params: Promise<{ lang?: string }>;
}) {
  const locale = getLocaleFromParams((await props.params).lang);
  const requestHeaders = await headers();
  const brand = getDocsBrandFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'localhost:3030'}/${locale}`,
  );
  const t = (text: string) => brandText(text, brand);
  const copy = content[locale];

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader publicOrigin={brand.publicOrigin} />
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-6 py-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-fd-muted-foreground">
            {t(copy.eyebrow)}
          </p>
          <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-7xl">
            {t(copy.title)}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-fd-muted-foreground">
            {t(copy.description)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={getLocalizedHref('/docs/apps/cc-switch-setup', locale)}
              className="inline-flex items-center gap-2 rounded-md bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition hover:opacity-90"
            >
              {copy.primary}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={getLocalizedHref('/docs/api-reference', locale)}
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition hover:bg-fd-accent"
            >
              {copy.secondary}
              <Sparkles className="size-4" />
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {['Claude Code', 'Codex CLI', 'Gemini CLI', 'OpenClaw'].map(
              (target) => (
                <span
                  key={target}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-fd-card px-3 py-1 text-sm text-fd-muted-foreground"
                >
                  <ClipboardCheck className="size-3.5 text-fd-primary" />
                  {target}
                </span>
              ),
            )}
          </div>
        </div>

        <section className="grid gap-8 border-t pt-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-sm font-medium uppercase text-fd-muted-foreground">
              {copy.setupLabel}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {t(copy.setupTitle)}
            </h2>
            <p className="mt-4 text-sm leading-6 text-fd-muted-foreground">
              {t(copy.setupDescription)}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {copy.setupPaths.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={getLocalizedHref(item.href, locale)}
                  className="group rounded-md border bg-fd-background/80 p-5 transition hover:bg-fd-accent/60"
                >
                  <div className="flex items-center justify-between gap-4">
                    <Icon className="size-5 text-fd-primary" />
                    <ArrowRight className="size-4 text-fd-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-fd-primary" />
                  </div>
                  <h3 className="mt-6 text-base font-semibold">{t(item.title)}</h3>
                  <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                    {t(item.description)}
                  </p>
                  <p className="mt-4 text-sm font-medium text-fd-primary">
                    {item.action}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-t pt-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium uppercase text-fd-muted-foreground">
                Recommended guides
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                {t(copy.docsTitle)}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-fd-muted-foreground">
                {t(copy.docsDescription)}
              </p>
            </div>
            <Link
              href={getLocalizedHref('/docs/apps', locale)}
              className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary"
            >
              {copy.docsAction}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {copy.docs.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={getLocalizedHref(item.href, locale)}
                  className="group rounded-lg border bg-fd-card p-5 transition hover:-translate-y-0.5 hover:bg-fd-accent/60"
                >
                  <Icon className="mb-8 size-5 text-fd-primary" />
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    {t(item.title)}
                    <ArrowRight className="size-4 opacity-0 transition group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                    {t(item.description)}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-md border bg-fd-card/50 p-4 text-sm leading-6 text-fd-muted-foreground">
            <Code2 className="mt-0.5 size-4 shrink-0 text-fd-primary" />
            <p>{t(copy.genericNote)}</p>
          </div>
        </section>
      </section>
    </main>
  );
}
