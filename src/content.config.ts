import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectMetadata, categoryMetadata } from './lib/project-schema.mjs';
const projects = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/projects' }), schema: ({ image }) => projectMetadata.extend({ cover: image() }) });
const categories = defineCollection({ loader: glob({ pattern: '*.json', base: './src/content/categories' }), schema: categoryMetadata });
export const collections = { projects, categories };
