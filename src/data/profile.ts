import { z } from 'astro/zod';
import raw from './profile.json' with { type: 'json' };
const text = z.string().trim().min(1);
const link = z.url().refine(value => /^https?:\/\//i.test(value), 'Use an HTTP or HTTPS URL');
export const profileSchema = z.object({
  name: text, role: text, intro: text, about: text, email: z.email(),
  linkedin: link, behance: link, instagram: z.preprocess(value => value === '' || value === null ? undefined : value, link.optional()), skills: z.array(text), tools: z.array(text),
  experience: z.array(z.object({ company: text, role: text, location: text, period: text })),
  education: z.object({ subject: text, institution: text, period: text })
});
export default profileSchema.parse(raw);
