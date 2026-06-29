import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { source } from '@/lib/source';
import { CodeExampleTabs } from '@/components/code-example-tabs';
import { ApiPlaygroundEmbed } from '@/components/api-playground-embed';
import { defaultLocale } from '@/lib/i18n';
import { getBrandedMdxComponents } from '@/lib/brand-mdx-components';
import { headers } from 'next/headers';
import {
  brandText,
  getDocsBrandFromHeaders,
  isAgentAppsSlug,
  isOfficialDocsBrand,
} from '@/lib/docs-brand';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, defaultLocale);

  if (!page) notFound();
  const requestHeaders = await headers();
  const brand = getDocsBrandFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'modelsell.com'}/docs`,
  );
  if (isAgentAppsSlug(params.slug) && !isOfficialDocsBrand(brand)) notFound();

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
    .filter((param) => param.lang === defaultLocale)
    .map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, defaultLocale);

  if (!page) notFound();

  const requestHeaders = await headers();
  const brand = getDocsBrandFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'modelsell.com'}/docs`,
  );
  if (isAgentAppsSlug(params.slug) && !isOfficialDocsBrand(brand)) notFound();

  return {
    title: brandText(page.data.title, brand),
    description: brandText(page.data.description ?? '', brand),
  };
}
