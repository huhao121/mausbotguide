import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

const SITE_NAME = 'MausBot Guide';
const HOME_TITLE = 'Unofficial OpenMausBot tutorials';
const AUTHOR = { '@type': 'Person', name: 'huhao121', url: 'https://github.com/huhao121' };

// Search results cut titles at about 60 Latin characters; a CJK character takes about two.
const MAX_TITLE_WIDTH = 60;
const titleWidth = (text: string) =>
	[...text].reduce((width, char) => width + (char.charCodeAt(0) > 255 ? 2 : 1), 0);

// Escaped so a "<" in a page title cannot close the script tag.
const jsonLd = (data: object) => JSON.stringify(data).replace(/</g, '\\u003c');

export const onRequest = defineRouteMiddleware((context) => {
	const { head, entry, lang } = context.locals.starlightRoute;
	const { title, description } = entry.data;
	const { pathname } = context.url;
	const { site } = context;
	const url = (path: string) => new URL(path, site).href;

	for (const tag of head) {
		// Starlight links to its own sitemap-index.xml; this site publishes one /sitemap.xml instead.
		if (tag.tag === 'link' && tag.attrs?.rel === 'sitemap') tag.attrs.href = '/sitemap.xml';
		if (tag.tag === 'title') {
			if (title === SITE_NAME) tag.content = `${HOME_TITLE} | ${SITE_NAME}`;
			else if (titleWidth(tag.content ?? '') > MAX_TITLE_WIDTH) tag.content = title;
		}
	}

	if (/\/404\/?$/.test(pathname) || pathname === '/zh/') return;

	const data =
		pathname === '/'
			? { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: url('/'), description }
			: {
					'@context': 'https://schema.org',
					'@graph': [
						{
							'@type': 'Article',
							headline: title,
							description,
							url: url(pathname),
							inLanguage: lang,
							image: url('/og.jpg'),
							author: AUTHOR,
						},
						{
							'@type': 'BreadcrumbList',
							itemListElement: [
								{
									'@type': 'ListItem',
									position: 1,
									name: lang === 'zh-CN' ? '首页' : 'Home',
									item: url(lang === 'zh-CN' ? '/zh/' : '/'),
								},
								{ '@type': 'ListItem', position: 2, name: title, item: url(pathname) },
							],
						},
					],
				};
	head.push({ tag: 'script', attrs: { type: 'application/ld+json' }, content: jsonLd(data) });
});
