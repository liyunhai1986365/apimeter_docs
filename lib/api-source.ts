import { loader } from 'fumadocs-core/source';
import { openapi } from '@/lib/openapi';
import { openapiPlugin } from 'fumadocs-openapi/server';

export const apiSourceData = await openapi.staticSource({
  groupBy: 'tag',
  meta: {
    folderStyle: 'separator',
  },
});

export const apiSource = loader({
  baseUrl: '/api-reference',
  source: apiSourceData,
  plugins: [openapiPlugin()],
});
