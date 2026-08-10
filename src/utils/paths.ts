export function generateFallbackPaths(langs: string[], slugs: string[], paramName: string) {
  const paths = [];
  for (const lang of langs) {
    for (const slug of slugs) {
      paths.push({ params: { lang, [paramName]: slug } });
    }
  }
  return paths;
}
