import type { APIRoute } from 'astro';
import { publishedProjects } from '../lib/projects';
export const GET: APIRoute = async ({ site }) => {
  const paths = ['/', '/work/', '/about/', ...(await publishedProjects()).map(p => '/work/' + p.data.slug + '/')];
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  const urls = site ? paths.map(path => '<url><loc>' + escape(new URL(path, site).href) + '</loc></url>').join('') : '';
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls + '</urlset>', { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
