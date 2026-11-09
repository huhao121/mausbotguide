import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

// Starlight links to its own sitemap-index.xml; this site publishes one /sitemap.xml instead.
export const onRequest = defineRouteMiddleware((context) => {
	for (const entry of context.locals.starlightRoute.head) {
		if (entry.tag === 'link' && entry.attrs?.rel === 'sitemap') entry.attrs.href = '/sitemap.xml';
	}
});
