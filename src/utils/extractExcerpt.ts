export function extractExcerpt(markdown: string, maxLength?: number): string {
  const firstParagraph = markdown.split(/\n\n+/)[0];
  let result = firstParagraph
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (maxLength !== undefined && result.length > maxLength) {
    result = result.slice(0, maxLength).replace(/\s\S*$/, "") + "…";
  }
  return result;
}
