import { createMDX } from 'fumadocs-mdx/next';

function normalizePathPrefix(value) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const normalized = `/${trimmed.replace(/^\/+|\/+$/g, '')}`;
  return normalized === '/' ? undefined : normalized;
}

const basePath = normalizePathPrefix(process.env.DOCS_BASE_PATH);
const assetPrefix = normalizePathPrefix(process.env.DOCS_ASSET_PREFIX);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  ...(assetPrefix ? { images: { path: `${assetPrefix}/_next/image` } } : {}),
  ...(basePath ? { basePath } : {}),
  ...(assetPrefix ? { assetPrefix } : {}),
};

const withMDX = createMDX();

export default withMDX(nextConfig);
