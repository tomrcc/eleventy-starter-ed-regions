import MarkdownIt from "markdown-it";

/**
 * Markdownify filter - converts Markdown text to HTML
 * Uses markdown-it library to parse and render Markdown
 * 
 * ⚠️ IMPORTANT: This filter uses an external dependency (markdown-it).
 * It ONLY works at build time (Eleventy). It will FAIL in CloudCannon's
 * live editor because the browser doesn't have access to the npm package.
 * 
 * Use this filter in static templates, NOT in editable components.
 * See filters/README.md for more details and workarounds.
 * 
 * @param {string} value - The Markdown text to convert
 * @returns {string} - HTML output
 * 
 * @example
 * {{ "**bold** text" | markdownify }}
 * "<p><strong>bold</strong> text</p>"
 * 
 * {{ "# Heading" | markdownify }}
 * "<h1>Heading</h1>"
 */
export default function markdownify(value) {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  });

  const str = String(value);
  return md.render(str);
}
