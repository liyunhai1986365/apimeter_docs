import Link from 'next/link';
import { SiteHeaderControls } from '@/components/site-header-controls';
import { siteNavigation } from '@/lib/site-navigation';

export function SiteHeader() {
  return (
    <header className="border-b bg-fd-background/95 px-6 py-3 backdrop-blur lg:px-10">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="https://modelsell.com/" className="text-sm font-semibold">
          ModelSell
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-fd-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {siteNavigation.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className="transition hover:text-fd-foreground"
              >
                {item.text}
              </Link>
            ))}
          </div>
          <SiteHeaderControls />
        </div>
      </nav>
    </header>
  );
}
