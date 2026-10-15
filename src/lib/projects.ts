import { getCollection } from 'astro:content';
import { validateSlugs, validateProjectCategories } from './project-schema.mjs';
export async function publishedProjects() {
  const [projects, categories] = await Promise.all([getCollection('projects'), getCollection('categories')]);
  validateSlugs(projects);
  validateProjectCategories(projects, categories);
  return projects.filter(project => project.data.status === 'published').sort((a, b) => a.data.order - b.data.order);
}
