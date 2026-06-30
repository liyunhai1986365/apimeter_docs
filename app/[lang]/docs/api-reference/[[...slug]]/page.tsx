import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { apiSource } from '@/lib/api-source';
import { APIPage } from '@/lib/api-page';
import { openapi } from '@/lib/openapi';
import { getLocalizedHref } from '@/lib/i18n-path';
import { defaultLocale, i18n } from '@/lib/i18n';
import { getLocaleFromParams } from '@/lib/i18n-path';
import { getApiReferenceMdxPage, getApiReferencePage } from '@/lib/api-reference-page';
import { getDocsBrandFromHeaders, brandText } from '@/lib/docs-brand';
import { brandOpenAPIDocument } from '@/lib/openapi-brand';
import { ApiReferenceMdxPage } from '@/lib/api-reference-mdx-page';
import { getApiReferenceMdxSlugs } from '@/lib/api-reference-mdx-pages';
import {
  DocsBody,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';

export const revalidate = false;

export default async function Page(props: {
  params: Promise<{ lang?: string; slug?: string[] | string }>;
}) {
  const params = await props.params;
  const locale = getLocaleFromParams(params.lang);
  const requestHeaders = await headers();
  const brand = getDocsBrandFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'modelsell.com'}/${locale}/docs/api-reference`,
  );

  if (!params.slug || params.slug.length === 0) {
    const firstPage = apiSource.getPages()[0];
    if (firstPage) redirect(getLocalizedHref(firstPage.url, locale));
  }

  const page = getApiReferencePage(params.slug);
  const mdxPage = getApiReferenceMdxPage(params.slug, locale);

  if (!page && !mdxPage) notFound();

  if (mdxPage) {
    return <ApiReferenceMdxPage page={mdxPage} brand={brand} />;
  }

  if (!page) notFound();
  const schema = await openapi.getSchema(page.data.getAPIPageProps().document);
  const apiPageProps = {
    ...page.data.getAPIPageProps(),
    document: {
      ...schema,
      bundled: brandOpenAPIDocument(schema.bundled, brand),
      dereferenced: brandOpenAPIDocument(schema.dereferenced, brand),
    },
  } as Parameters<typeof APIPage>[0];

  return (
    <DocsPage toc={page.data.toc} full>
      <DocsTitle>{brandText(page.data.title ?? '', brand)}</DocsTitle>
      <DocsBody>
        <APIPage {...apiPageProps} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return i18n.languages
    .filter((lang) => lang !== defaultLocale)
    .flatMap((lang) => {
      const apiParams = apiSource.generateParams().map((param) => ({
        slug: param.slug,
        lang,
      }));
      const mdxParams = getApiReferenceMdxSlugs(lang).map((slug) => ({
        slug: [...slug],
        lang,
      }));

      return apiParams.concat(mdxParams);
    });
}

export async function generateMetadata(props: {
  params: Promise<{ lang?: string; slug?: string[] | string }>;
}) {
  const params = await props.params;
  const locale = getLocaleFromParams(params.lang);
  const page = getApiReferencePage(params.slug);
  const mdxPage = getApiReferenceMdxPage(params.slug, locale);

  if (!page && !mdxPage) notFound();
  const requestHeaders = await headers();
  const brand = getDocsBrandFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'modelsell.com'}/${locale}/docs/api-reference`,
  );

  if (mdxPage) {
    return {
      title: brandText(mdxPage.data.title, brand),
      description: brandText(mdxPage.data.description ?? '', brand),
    };
  }

  if (!page) notFound();
  return {
    title: brandText(page.data.title ?? '', brand),
    description: brandText(page.data.description ?? '', brand),
  };
}
