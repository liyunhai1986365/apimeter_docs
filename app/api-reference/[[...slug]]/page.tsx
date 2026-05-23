import { redirect } from 'next/navigation';

export const revalidate = false;

export default async function Page(props: {
  params: Promise<{ slug?: string[] | string }>;
}) {
  const params = await props.params;
  const slug = Array.isArray(params.slug)
    ? params.slug.join('/')
    : params.slug;

  redirect(slug ? `/docs/api-reference/${slug}` : '/docs/api-reference');
}

export function generateStaticParams() {
  return [];
}
