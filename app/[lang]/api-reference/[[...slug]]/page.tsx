import { notFound, redirect } from 'next/navigation';
import { createAPIPage } from 'fumadocs-openapi/ui';
import { openapi } from '@/lib/openapi';
import { apiSource } from '@/lib/api-source';
import { getLocalizedHref } from '@/lib/i18n-path';
import { defaultLocale, i18n } from '@/lib/i18n';
import { getLocaleFromParams } from '@/lib/i18n-path';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';

export const revalidate = false;

const APIPage = createAPIPage(openapi, {
  playground: {
    enabled: true,
  },
});

export default async function Page(props: {
  params: Promise<{ lang?: string; slug?: string[] }>;
}) {
  const params = await props.params;
  const locale = getLocaleFromParams(params.lang);

  if (!params.slug || params.slug.length === 0) {
    const firstPage = apiSource.getPages()[0];
    if (firstPage) redirect(getLocalizedHref(firstPage.url, locale));
  }

  const page = apiSource.getPage(params.slug);

  if (!page) notFound();

  return (
    <DocsPage toc={page.data.toc} full>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <APIPage {...page.data.getAPIPageProps()} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return i18n.languages
    .filter((lang) => lang !== defaultLocale)
    .flatMap((lang) =>
      apiSource.generateParams().map((param) => ({
        ...param,
        lang,
      })),
    );
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = apiSource.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
