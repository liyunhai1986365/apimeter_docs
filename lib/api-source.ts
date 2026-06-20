import { loader } from 'fumadocs-core/source';
import { openapi } from '@/lib/openapi';
import { openapiPlugin } from 'fumadocs-openapi/server';
import { withoutHiddenApiReferencePages } from '@/lib/api-source-filter';

export const apiSourceData = withoutHiddenApiReferencePages(await openapi.staticSource({
  groupBy: 'tag',
  meta: {
    folderStyle: 'separator',
  },
}));

export const apiSource = loader({
  baseUrl: '/docs/api-reference',
  source: apiSourceData,
  plugins: [openapiPlugin()],
});
