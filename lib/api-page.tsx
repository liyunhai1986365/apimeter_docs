import { createAPIPage } from 'fumadocs-openapi/ui';
import { openapi } from '@/lib/openapi';

export const APIPage = createAPIPage(openapi, {
  playground: {
    enabled: true,
  },
  client: {
    playground: {
      fetchOptions: {
        proxyForwardCookie: false,
        requestTimeout: 120,
      },
    },
  },
});
