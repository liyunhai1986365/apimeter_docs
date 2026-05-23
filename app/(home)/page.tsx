import Link from 'next/link';
import { ArrowRight, BookOpen, Play, TerminalSquare } from 'lucide-react';

const links = [
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
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-6 py-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-fd-muted-foreground">
            ModelSell Developer Docs
          </p>
          <h1 className="text-balance text-5xl font-semibold tracking-tight md:text-7xl">
            Docs, API reference, and executable examples in one place.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-fd-muted-foreground">
            Built with Fumadocs for fast documentation browsing, MDX authoring,
            and an OpenAPI-backed playground for testing model endpoints.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-md bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition hover:opacity-90"
            >
              Start reading
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/docs/api-reference"
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition hover:bg-fd-accent"
            >
              API playground
              <Play className="size-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
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
