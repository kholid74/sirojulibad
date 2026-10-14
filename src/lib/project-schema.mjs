import { z } from 'astro/zod';
export const categories = ['Web Design', 'Mobile Design', 'Dashboard Design', 'Games'];
const blank = value => value === '' || value === null ? undefined : value;
const optionalText = z.preprocess(blank, z.string().trim().min(1).optional());
const externalUrl = z.preprocess(blank, z.url().refine(value => /^https?:\/\//i.test(value), 'Use an HTTP or HTTPS URL').optional());
export const projectMetadata = z.object({
  title: z.string().trim().min(1), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(categories), summary: z.string().trim().min(1), coverAlt: z.string().trim().min(1),
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
