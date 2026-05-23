import { notFound, redirect } from 'next/navigation';
import { apiSource } from '@/lib/api-source';
import { getApiReferencePage } from '@/lib/api-reference-page';
import { APIPage } from '@/lib/api-page';
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
  if (!params.slug || params.slug.length === 0) {
    const firstPage = apiSource.getPages()[0];
    if (firstPage) redirect(firstPage.url);
  }

  const page = getApiReferencePage(params.slug);

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
  return apiSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] | string }>;
}) {
  const params = await props.params;
  const page = getApiReferencePage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
