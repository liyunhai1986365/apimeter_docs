import { notFound } from 'next/navigation';
import { APIPage } from '@/lib/api-page';
import { getApiReferencePage } from '@/lib/api-reference-page';
import { getApiPlaygroundSlugs } from '@/lib/api-playground-path';

type ApiPlaygroundEmbedProps = {
  href: string;
  title?: string;
};

export function ApiPlaygroundEmbed({ href, title }: ApiPlaygroundEmbedProps) {
  const slugs = getApiPlaygroundSlugs(href);
  if (!slugs) notFound();

  const page = getApiReferencePage(slugs);
  if (!page) notFound();

  return (
    <section className="not-prose my-8 overflow-hidden rounded-xl border bg-fd-card shadow-sm">
      <div className="border-b bg-fd-muted/30 px-4 py-3">
        <p className="text-sm font-medium text-fd-foreground">
          {title ?? page.data.title}
        </p>
        {page.data.description ? (
          <p className="mt-1 text-sm text-fd-muted-foreground">
            {page.data.description}
          </p>
        ) : null}
      </div>
      <div className="p-3 md:p-4">
        <APIPage {...page.data.getAPIPageProps()} />
      </div>
    </section>
  );
}
