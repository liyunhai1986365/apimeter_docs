import { notFound } from 'next/navigation';
import { createEmbeddedAPIPage } from '@/lib/api-page';
import { getApiReferencePage } from '@/lib/api-reference-page';
import { getApiPlaygroundSlugs } from '@/lib/api-playground-path';
import { apiSource } from '@/lib/api-source';

const embeddedAPIPages = Object.fromEntries(
  apiSource.getPages().map((page) => [
    page.url,
    createEmbeddedAPIPage(page.slugs.join('-')),
  ]),
);

type ApiPlaygroundEmbedProps = {
  href: string;
  title?: string;
};

export function ApiPlaygroundEmbed({ href, title }: ApiPlaygroundEmbedProps) {
  const slugs = getApiPlaygroundSlugs(href);
  if (!slugs) notFound();

  const page = getApiReferencePage(slugs);
  if (!page) notFound();

  const EmbeddedAPIPage = embeddedAPIPages[page.url];
  if (!EmbeddedAPIPage) notFound();

  return (
    <section className="not-prose my-8 overflow-hidden rounded-xl border bg-fd-card shadow-sm">
      <div className="border-b bg-fd-muted/30 px-4 py-3">
        <p className="text-sm font-medium text-fd-foreground">
          {title ?? page.data.title}
        </p>
      </div>
      <div className="p-3 md:p-4">
        <EmbeddedAPIPage {...page.data.getAPIPageProps()} />
      </div>
    </section>
  );
}
