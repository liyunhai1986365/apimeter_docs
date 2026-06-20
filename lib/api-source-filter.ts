export const hiddenApiReferenceSlugs = new Set(['createCompletion', 'compactResponse']);

function isHiddenApiReferencePage(path: string) {
  const fileName = path.split('/').at(-1) ?? '';
  const slug = fileName.replace(/\.mdx$/, '');

  return hiddenApiReferenceSlugs.has(slug);
}

export function withoutHiddenApiReferencePages<
  T extends { files: Array<{ type: string; path: string; data: unknown }> },
>(source: T): T {
  return {
    ...source,
    files: source.files
      .filter((file) => file.type !== 'page' || !isHiddenApiReferencePage(file.path))
      .map((file) => {
        if (file.type !== 'meta') return file;

        const data = file.data as { pages?: unknown };
        if (!Array.isArray(data.pages)) return file;

        return {
          ...file,
          data: {
            ...data,
            pages: data.pages.filter((page) => (
              typeof page !== 'string' || !hiddenApiReferenceSlugs.has(page)
            )),
          },
        };
      }),
  };
}
