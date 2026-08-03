import { Children, cloneElement, createElement, isValidElement } from 'react';
import type { ComponentType, HTMLAttributes, ReactNode } from 'react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { DocsBrand } from '@/lib/docs-brand';
import { brandText } from '@/lib/docs-brand';

type MdxComponentProps = Record<string, unknown> & {
  children?: ReactNode;
};
type MdxComponentMap = Record<string, ComponentType<MdxComponentProps>>;

function brandChildren(children: ReactNode, brand: DocsBrand): ReactNode {
  if (typeof children === 'string') return brandText(children, brand);
  if (Array.isArray(children)) {
    return Children.map(children, (child) => brandChildren(child, brand));
  }
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return cloneElement(
      children,
      undefined,
      brandChildren(children.props.children, brand),
    );
  }
  return children;
}

type BrandableTag = 'p' | 'li' | 'td' | 'th' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

function brandStringProps<T extends Record<string, unknown>>(props: T, brand: DocsBrand): T {
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [
      key,
      typeof value === 'string' ? brandText(value, brand) : value,
    ]),
  ) as T;
}

function createBrandedComponent(tag: BrandableTag, brand: DocsBrand) {
  return function BrandedComponent(props: HTMLAttributes<HTMLElement>) {
    return createElement(
      tag,
      brandStringProps(props, brand),
      brandChildren(props.children, brand),
    );
  };
}

function createBrandedMdxComponent(Component: ComponentType<MdxComponentProps>, brand: DocsBrand) {
  return function BrandedMdxComponent(props: MdxComponentProps) {
    const { children, ...rest } = props;

    return createElement(
      Component,
      brandStringProps(rest, brand),
      brandChildren(children, brand),
    );
  };
}

export function getBrandedMdxComponents(
  brand: DocsBrand,
  extra: MdxComponentMap = {},
) {
  const brandedDefaults = Object.fromEntries(
    Object.entries(defaultMdxComponents).map(([name, Component]) => [
      name,
      createBrandedMdxComponent(Component as ComponentType<MdxComponentProps>, brand),
    ]),
  );
  const brandedExtra = Object.fromEntries(
    Object.entries(extra).map(([name, Component]) => [
      name,
      createBrandedMdxComponent(Component, brand),
    ]),
  );

  return {
    ...brandedDefaults,
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
    ...brandedExtra,
  };
}
