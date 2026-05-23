import Link from 'next/link';
import { ArrowRight, BookOpen, Play, TerminalSquare } from 'lucide-react';
import { getLocaleFromParams, getLocalizedHref } from '@/lib/i18n-path';

const content = {
  en: {
    eyebrow: 'ModelSell Developer Docs',
    title: 'Docs, API reference, and executable examples in one place.',
    description:
      'Built with Fumadocs for fast documentation browsing, MDX authoring, and an OpenAPI-backed playground for testing model endpoints.',
    primary: 'Start reading',
    secondary: 'API playground',
    cards: [
      {
        href: '/docs',
        title: 'Read the guides',
        description: 'Install, authenticate, and send the first model request.',
        icon: BookOpen,
      },
      {
        href: '/docs/models/chat-completions',
        title: 'Copy code examples',
        description: 'Switch between curl, JavaScript, and Python examples in MDX.',
        icon: TerminalSquare,
      },
      {
        href: '/docs/api-reference/ai-%E6%A8%A1%E5%9E%8B---%E8%81%8A%E5%A4%A9/createChatCompletion',
        title: 'Open API playground',
        description: 'Inspect parameters and try API requests from the reference.',
        icon: Play,
      },
    ],
  },
  zh: {
    eyebrow: 'ModelSell 开发者文档',
    title: '文档、API Reference 和可执行示例集中在一处。',
    description:
      '基于 Fumadocs 构建，支持快速浏览文档、编写 MDX 内容，并通过 OpenAPI Playground 调试模型接口。',
    primary: '开始阅读',
    secondary: 'API Playground',
    cards: [
      {
        href: '/docs',
        title: '阅读指南',
        description: '安装、认证，并发送第一个模型请求。',
        icon: BookOpen,
      },
      {
        href: '/docs/models/chat-completions',
        title: '复制代码示例',
        description: '在 MDX 中切换 curl、JavaScript 和 Python 示例。',
        icon: TerminalSquare,
      },
      {
        href: '/docs/api-reference/ai-%E6%A8%A1%E5%9E%8B---%E8%81%8A%E5%A4%A9/createChatCompletion',
        title: '打开 API Playground',
        description: '查看参数并在 API Reference 中尝试请求。',
        icon: Play,
      },
    ],
  },
};

export default async function LocalizedHomePage(props: {
  params: Promise<{ lang?: string }>;
}) {
  const locale = getLocaleFromParams((await props.params).lang);
  const copy = content[locale];

  return (
    <main className="flex min-h-screen flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-6 py-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-fd-muted-foreground">
            {copy.eyebrow}
          </p>
          <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-fd-muted-foreground">
            {copy.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={getLocalizedHref('/docs', locale)}
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
              <Play className="size-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {copy.cards.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={getLocalizedHref(item.href, locale)}
                className="group rounded-lg border bg-fd-card p-5 transition hover:-translate-y-0.5 hover:bg-fd-accent/60"
              >
                <Icon className="mb-8 size-5 text-fd-primary" />
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  {item.title}
                  <ArrowRight className="size-4 opacity-0 transition group-hover:opacity-100" />
                </h2>
                <p className="mt-2 text-sm leading-6 text-fd-muted-foreground">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
