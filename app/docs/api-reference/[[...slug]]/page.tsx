import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { apiSource } from '@/lib/api-source';
import { getApiReferencePage } from '@/lib/api-reference-page';
import { APIPage } from '@/lib/api-page';
import { openapi } from '@/lib/openapi';
import { getDocsBrandFromHeaders, brandText } from '@/lib/docs-brand';
import { brandOpenAPIDocument } from '@/lib/openapi-brand';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';

export const revalidate = false;

export default async function Page(props: {
  params: Promise<{ slug?: string[] | string }>;
}) {
  const params = await props.params;
  const requestHeaders = await headers();
  const brand = getDocsBrandFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'modelsell.com'}/docs/api-reference`,
  );
  if (!params.slug || params.slug.length === 0) {
    const firstPage = apiSource.getPages()[0];
    if (firstPage) redirect(firstPage.url);
  }

  const page = getApiReferencePage(params.slug);

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
      <DocsDescription>{brandText(page.data.description ?? '', brand)}</DocsDescription>
      <DocsBody>
        <APIPage {...apiPageProps} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return apiSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] | string }>;
}) {
  const params = await props.params;
  const page = getApiReferencePage(params.slug);

  if (!page) notFound();
  const requestHeaders = await headers();
  const brand = getDocsBrandFromHeaders(
    new Headers(requestHeaders),
    `https://${requestHeaders.get('host') ?? 'modelsell.com'}/docs/api-reference`,
  );

  return {
    title: brandText(page.data.title ?? '', brand),
    description: brandText(page.data.description ?? '', brand),
  };
}
