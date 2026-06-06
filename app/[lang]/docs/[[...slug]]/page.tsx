import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { ApiPlaygroundEmbed } from '@/components/api-playground-embed';
import { CodeExampleTabs } from '@/components/code-example-tabs';
import { getLocaleFromParams } from '@/lib/i18n-path';
import { i18n } from '@/lib/i18n';
import { source } from '@/lib/source';
import { getBrandedMdxComponents } from '@/lib/brand-mdx-components';
import { headers } from 'next/headers';
import { getDocsBrandFromHeaders, brandText } from '@/lib/docs-brand';

export default async function Page(props: {
  params: Promise<{ lang?: string; slug?: string[] }>;
}) {
  const params = await props.params;
  const locale = getLocaleFromParams(params.lang);
  const page = source.getPage(params.slug, locale);

  if (!page) notFound();
  const requestHeaders = await headers();
  const brand = getDocsBrandFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'modelsell.com'}/${locale}/docs`,
  );

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{brandText(page.data.title, brand)}</DocsTitle>
      <DocsDescription>{brandText(page.data.description ?? '', brand)}</DocsDescription>
      <DocsBody>
        <MDX
          components={getBrandedMdxComponents(brand, {
            ApiPlaygroundEmbed,
            CodeExampleTabs,
          })}
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

  const requestHeaders = await headers();
  const brand = getDocsBrandFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'modelsell.com'}/${locale}/docs`,
  );

  return {
    title: brandText(page.data.title, brand),
    description: brandText(page.data.description ?? '', brand),
  };
}
