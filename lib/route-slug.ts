export function decodeRouteSlug(slug?: string[] | string): string[] | undefined {
  if (!slug) return undefined;

  const segments = (Array.isArray(slug) ? slug : [slug]).flatMap((segment) =>
    segment.split('/'),
  );

  return segments.map((segment) => {
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  });
}
