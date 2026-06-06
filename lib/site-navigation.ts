import { getConfiguredPublicOrigin } from '@/lib/public-origin';

function withPath(origin: string, path: string) {
  return new URL(path, origin).toString();
}

export function getSiteNavigation(origin = getConfiguredPublicOrigin()) {
  return [
    {
      text: '首页',
      url: withPath(origin, '/'),
    },
    {
      text: '控制台',
      url: withPath(origin, '/dashboard/overview'),
    },
    {
      text: '模型广场',
      url: withPath(origin, '/pricing'),
    },
    {
      text: 'Agent 工具接入',
      url: withPath(origin, '/docs'),
    },
  ] as const;
}

export const siteNavigation = getSiteNavigation();
