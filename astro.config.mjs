import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
const site = process.env.SITE_URL;
if (site && (!/^https:\/\//.test(site) || new URL(site).pathname !== '/')) throw new Error('SITE_URL must be an HTTPS origin without a path.');
export default defineConfig({ site, output: 'static', trailingSlash: 'always', vite: { plugins: [tailwindcss()] } });
