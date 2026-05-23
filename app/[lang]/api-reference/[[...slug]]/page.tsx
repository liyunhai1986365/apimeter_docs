import { redirect } from 'next/navigation';
import { getLocalizedHref } from '@/lib/i18n-path';
import { i18n } from '@/lib/i18n';
import { getLocaleFromParams } from '@/lib/i18n-path';

export const revalidate = false;

export default async function Page(props: {
  params: Promise<{ lang?: string; slug?: string[] | string }>;
}) {
  const params = await props.params;
  const locale = getLocaleFromParams(params.lang);
  const slug = Array.isArray(params.slug)
    ? params.slug.join('/')
    : params.slug;
  const target = slug ? `/docs/api-reference/${slug}` : '/docs/api-reference';

  redirect(getLocalizedHref(target, locale));
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
