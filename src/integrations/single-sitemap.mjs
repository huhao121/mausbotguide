import { readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/**
 * Writes one plain /sitemap.xml and removes the sitemap-index.xml and sitemap-0.xml
 * that Starlight's sitemap integration generates. Language alternates stay in each
 * page's <head>, so the sitemap needs nothing but the URLs.
 * @returns {import('astro').AstroIntegration}
 */
export default function singleSitemap() {
	/** @type {string} */
	let site;
	return {
		name: 'mbg-single-sitemap',
		hooks: {
			'astro:config:done': ({ config: { site: origin } }) => {
				site = String(origin).replace(/\/$/, '');
			},
			'astro:build:done': async ({ dir, pages }) => {
				const root = fileURLToPath(dir);
				for (const file of await readdir(root)) {
					if (/^sitemap-.*\.xml$/.test(file)) await rm(`${root}${file}`);
				}
				const urls = pages
					.map((page) => page.pathname)
					.filter((path) => !/^(.*\/)?404\/?$/.test(path))
					.sort()
					.map((path) => `  <url><loc>${site}/${path}</loc></url>`);
				const xml = [
					'<?xml version="1.0" encoding="UTF-8"?>',
					'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
					...urls,
					'</urlset>',
					'',
				].join('\n');
				await writeFile(`${root}sitemap.xml`, xml);
			},
		},
	};
}
