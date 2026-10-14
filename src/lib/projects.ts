import { getCollection } from 'astro:content';
import { validateSlugs } from './project-schema.mjs';
export async function publishedProjects() {
  const projects = await getCollection('projects');
  validateSlugs(projects);
  return projects.filter(project => project.data.status === 'published').sort((a, b) => a.data.order - b.data.order);
}
