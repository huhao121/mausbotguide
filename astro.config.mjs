// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { locales } from './src/locales.mjs';
import singleSitemap from './src/integrations/single-sitemap.mjs';


// Build id rendered into every page so the deploy smoke test can confirm the new version is live.
const buildId = process.env.BUILD_ID ?? 'local';

// https://astro.build/config
export default defineConfig({
	site: 'https://mausbotguide.com',
	trailingSlash: 'always',
	// The dev toolbar only shows in `astro dev`; we don't use it.
	devToolbar: { enabled: false },
	integrations: [
		starlight({
			title: 'MausBot Guide',
			routeMiddleware: './src/routeData.ts',
			description:
				'Unofficial, hands-on guides for OpenMausBot: install, connect engines, run bots 24/7, and pick the right hardware.',
			defaultLocale: 'root',
			locales,
			social: [
				{ icon: 'github', label: 'This guide on GitHub', href: 'https://github.com/huhao121/mausbotguide' },
			],
			logo: { light: './src/assets/logo-light.svg', dark: './src/assets/logo-dark.svg', alt: '' },
			favicon: '/favicon.svg',
			customCss: ['@fontsource-variable/source-serif-4', './src/styles/theme.css'],
			expressiveCode: {
				themes: ['github-dark-default', 'github-light'],
				defaultProps: { wrap: true },
				styleOverrides: {
					borderRadius: '14px',
					borderColor: 'var(--sl-color-hairline)',
					codeFontSize: '0.875rem',
					codeLineHeight: '1.7',
					codePaddingBlock: '0.9rem',
					codePaddingInline: '1.1rem',
					frames: {
						shadowColor: 'transparent',
						editorTabBarBackground: 'var(--sl-color-gray-7)',
						editorActiveTabBackground: 'var(--sl-color-gray-7)',
						editorActiveTabIndicatorBottomColor: 'transparent',
						editorActiveTabIndicatorTopColor: 'transparent',
						editorTabBarBorderBottomColor: 'var(--sl-color-hairline)',
						terminalTitlebarBackground: 'var(--sl-color-gray-7)',
						terminalTitlebarBorderBottomColor: 'var(--sl-color-hairline)',
						terminalBackground: 'var(--mbg-card)',
						editorBackground: 'var(--mbg-card)',
						frameBoxShadowCssValue: 'none',
					},
				},
			},
			components: {
				PageTitle: './src/components/PageTitle.astro',
				Footer: './src/components/Footer.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
				LanguageSelect: './src/components/LanguageSelect.astro',
			},
			lastUpdated: true,
			head: [
				{ tag: 'meta', attrs: { name: 'x-build', content: buildId } },
				{ tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://mausbotguide.com/og.jpg' } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: 'https://mausbotguide.com/og.jpg' } },
			],
			sidebar: [
				{
					label: 'Get started',
					translations: { 'zh-CN': '入门' },
					items: [{ autogenerate: { directory: 'start' } }],
				},
				{
					label: 'Use cases',
					translations: { 'zh-CN': '实战案例' },
					items: [{ autogenerate: { directory: 'recipes' } }],
				},
				{
					label: 'How-to guides',
					translations: { 'zh-CN': '操作指南' },
					items: [{ autogenerate: { directory: 'guides' } }],
				},
				{
					label: 'Concepts',
					translations: { 'zh-CN': '核心概念' },
					items: [{ autogenerate: { directory: 'concepts' } }],
				},
				{
					label: 'Reference',
					translations: { 'zh-CN': '参考' },
					items: [{ autogenerate: { directory: 'reference' } }],
				},
			],
		}),
		// Must stay after starlight(): it replaces the sitemap files Starlight generates.
		singleSitemap(),
	],
});
