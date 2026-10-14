import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectMetadata } from './lib/project-schema.mjs';
const projects = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/projects' }), schema: ({ image }) => projectMetadata.extend({ cover: image() }) });
export const collections = { projects };
