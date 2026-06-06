import { createElement } from 'react';
import type { ComponentType, HTMLAttributes, ReactNode } from 'react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { DocsBrand } from '@/lib/docs-brand';
import { brandText } from '@/lib/docs-brand';

type MdxComponentMap = Record<string, ComponentType<any>>;

function brandChildren(children: ReactNode, brand: DocsBrand): ReactNode {
  if (typeof children === 'string') return brandText(children, brand);
  if (Array.isArray(children)) return children.map((child) => brandChildren(child, brand));
  return children;
}

type BrandableTag = 'p' | 'li' | 'td' | 'th' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

function createBrandedComponent(tag: BrandableTag, brand: DocsBrand) {
  return function BrandedComponent(props: HTMLAttributes<HTMLElement>) {
    return createElement(tag, props, brandChildren(props.children, brand));
  };
}

export function getBrandedMdxComponents(
  brand: DocsBrand,
  extra: MdxComponentMap = {},
) {
  return {
    ...defaultMdxComponents,
    p: createBrandedComponent('p', brand),
    li: createBrandedComponent('li', brand),
    td: createBrandedComponent('td', brand),
    th: createBrandedComponent('th', brand),
    h1: createBrandedComponent('h1', brand),
    h2: createBrandedComponent('h2', brand),
    h3: createBrandedComponent('h3', brand),
    h4: createBrandedComponent('h4', brand),
    h5: createBrandedComponent('h5', brand),
    h6: createBrandedComponent('h6', brand),
    ...extra,
  };
}
