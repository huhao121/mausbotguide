// Single source of truth for site locales (used by astro.config.mjs and LanguageSelect).
/** @type {Record<string, { label: string; lang: string }>} */
export const locales = {
	root: { label: 'English', lang: 'en' },
	zh: { label: '简体中文', lang: 'zh-CN' },
};
