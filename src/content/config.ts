import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tagsSchema = z.union([z.string(), z.array(z.string())]).optional();
const categoriesSchema = z
  .union([z.string(), z.array(z.string()), z.array(z.array(z.string()))])
  .optional();

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './source/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    link: z.string().optional(),
    date: z.coerce.date(),
    cover: z.string().optional(),
    tags: tagsSchema,
    categories: categoriesSchema,
    subtitle: z.string().optional(),
    catalog: z.boolean().optional(),
    tocNumbering: z.boolean().optional(),
    sticky: z.boolean().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { blog };
