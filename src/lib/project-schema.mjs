import { z } from 'astro/zod';
const blank = value => value === '' || value === null ? undefined : value;
const optionalText = z.preprocess(blank, z.string().trim().min(1).optional());
const externalUrl = z.preprocess(blank, z.url().refine(value => /^https?:\/\//i.test(value), 'Use an HTTP or HTTPS URL').optional());
export const categoryMetadata = z.object({
  name: z.string().trim().min(1).refine(name => name.toLowerCase() !== 'all', 'All is reserved for the project filter'),
  order: z.preprocess(blank, z.number().int().nonnegative().default(100))
});
export const projectMetadata = z.object({
  title: z.string().trim().min(1), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(1), summary: z.string().trim().min(1), coverAlt: z.string().trim().min(1),
  coverStyle: z.enum(['screen', 'logo']).default('screen'),
  featuredOrder: z.preprocess(blank, z.number().int().positive().optional()), order: z.preprocess(blank, z.number().int().default(100)),
  status: z.enum(['published', 'draft']).default('draft'),
  role: optionalText, year: optionalText,
  website: externalUrl, behance: externalUrl
});
/** @template {{data: {slug: string}}} T
 * @param {T[]} projects */
export function validateSlugs(projects) {
  const slugs = new Set();
  for (const project of projects) {
    if (slugs.has(project.data.slug)) throw new Error('Duplicate project slug: ' + project.data.slug);
    slugs.add(project.data.slug);
  }
  return projects;
}

/** @param {{data: {slug: string, category: string}}[]} projects
 * @param {{data: {name: string}}[]} categories */
export function validateProjectCategories(projects, categories) {
  const names = new Set();
  const keys = new Set();
  for (const category of categories) {
    const name = category.data.name;
    const key = name.toLowerCase();
    if (keys.has(key)) throw new Error('Duplicate portfolio category: ' + name);
    keys.add(key);
    names.add(name);
  }
  for (const project of projects) {
    if (!names.has(project.data.category)) throw new Error('Unknown portfolio category "' + project.data.category + '" in project "' + project.data.slug + '". Create the category or reassign the project before deleting or renaming it.');
  }
}
