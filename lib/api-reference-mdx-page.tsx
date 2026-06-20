import { ApiPlaygroundEmbed } from '@/components/api-playground-embed';
import { CodeExampleTabs } from '@/components/code-example-tabs';
import { getBrandedMdxComponents } from '@/lib/brand-mdx-components';
import type { DocsBrand } from '@/lib/docs-brand';
import { brandText } from '@/lib/docs-brand';
import type { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';

type ApiReferenceMdxPageProps = {
  page: NonNullable<ReturnType<typeof source.getPage>>;
  brand: DocsBrand;
};

export function ApiReferenceMdxPage({ page, brand }: ApiReferenceMdxPageProps) {
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
