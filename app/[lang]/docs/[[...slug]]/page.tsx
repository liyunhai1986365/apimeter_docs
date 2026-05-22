import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { ApiPlaygroundEmbed } from '@/components/api-playground-embed';
import { CodeExampleTabs } from '@/components/code-example-tabs';
import { getLocaleFromParams } from '@/lib/i18n-path';
import { i18n } from '@/lib/i18n';
import { source } from '@/lib/source';

export default async function Page(props: {
  params: Promise<{ lang?: string; slug?: string[] }>;
}) {
  const params = await props.params;
  const locale = getLocaleFromParams(params.lang);
  const page = source.getPage(params.slug, locale);

  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            ApiPlaygroundEmbed,
            CodeExampleTabs,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source
    .generateParams('slug', 'lang')
    .filter((param) => param.lang !== i18n.defaultLanguage);
}

export async function generateMetadata(props: {
  params: Promise<{ lang?: string; slug?: string[] }>;
}) {
  const params = await props.params;
  const locale = getLocaleFromParams(params.lang);
  const page = source.getPage(params.slug, locale);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
