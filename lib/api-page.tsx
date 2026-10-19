import { createAPIPage } from 'fumadocs-openapi/ui';
import { Heading } from 'fumadocs-ui/components/heading';
import { openapi } from '@/lib/openapi';

const options = {
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
};

export const APIPage = createAPIPage(openapi, options);

export function createEmbeddedAPIPage(anchorPrefix: string) {
  return createAPIPage(openapi, {
    ...options,
    renderHeading: (props, depth) => (
      <Heading
        {...props}
        as={`h${Math.min(depth + 1, 6)}` as 'h3' | 'h4' | 'h5' | 'h6'}
        id={`${anchorPrefix}-${props.id}`}
      />
    ),
  });
}
