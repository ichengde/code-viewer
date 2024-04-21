import { html } from 'hono/html';

export const highLightCode = html`
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/atom-one-dark.min.css">
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>

<!-- and it's easy to individually load additional languages -->
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/javascript.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/typescript.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/json.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/csharp.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/css.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/sql.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/yaml.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/css.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/markdown.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/languages/shell.min.js"></script>

<script>hljs.highlightAll();</script>
`;

export interface SiteData {
  title: string;
  description: string;
  image: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  head?: any;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  children?: any;
}

export const Layout = (props: SiteData) => html`
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />
  <title>${props.title}</title>
  <meta name="description" content="${props.description}" />
  <head prefix="og: http://ogp.me/ns#" />
  <meta property="og:type" content="article" />
  <!-- More elements slow down JSX, but not template literals. -->
  <meta property="og:title" content="${props.title}" />
  <meta property="og:image" content="${props.image}" />
  <link href="/static/tailwind.css" rel="stylesheet" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

  ${highLightCode}
  ${props.head}
  </head>
<body >
  <div class="ml-safe mr-safe">
    ${props.children}
  </div>
</body>
</html>
`;
