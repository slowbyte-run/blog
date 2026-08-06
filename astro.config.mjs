import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import pagefind from 'astro-pagefind';
import mermaid from 'astro-mermaid';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import svgr from 'vite-plugin-svgr';
import { rm } from 'node:fs/promises';
import { blogLayoutConfig } from './src/config/blogLayoutConfig.js';
import { defaultContentConfig } from './src/constants/content-config.js';
import { remarkLinkEmbed } from './src/lib/markdown/remark-link-embed.js';
import { rehypeImagePlaceholder } from './src/lib/markdown/rehype-image-placeholder.js';

const sourcePublicDir = {
  name: 'source-public-dir',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const postsDir = new URL('posts/', dir);
      await rm(postsDir, { recursive: true, force: true });
      logger.info('Removed source/posts from build output.');
    },
  },
};

export default defineConfig({
  srcDir: 'src',
  publicDir: 'source',
  alias: {
    '@': './src',
  },
  site: blogLayoutConfig.site,
  compressHTML: true,
  markdown: {
    gfm: true,
    remarkPlugins: [
      [
        remarkLinkEmbed,
        {
          enableTweetEmbed: defaultContentConfig.enableTweetEmbed,
          enableOGPreview: defaultContentConfig.enableOGPreview,
        },
      ],
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            className: ['anchor-link'],
          },
        },
      ],
      rehypeImagePlaceholder,
    ],
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  integrations: [
    sourcePublicDir,
    react(),
    tailwind({
      config: './tailwind.config.mjs',
    }),
    icon({
      include: {
        gg: ['*'],
        'fa6-regular': ['*'],
        'fa6-solid': ['*'],
        ri: ['*'],
      },
    }),
    pagefind(),
    mermaid({
      autoTheme: true,
    }),
  ],
  vite: {
    plugins: [svgr()],
    ssr: {
      noExternal: ['react-tweet'],
    },
  },
  trailingSlash: 'ignore',
});
