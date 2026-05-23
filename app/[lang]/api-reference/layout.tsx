import type { ReactNode } from 'react';

export default async function Layout({
  children,
}: {
  children: ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  return children;
}
