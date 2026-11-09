import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				// OpenMausBot version the steps were last run against, e.g. "0.1.146".
				verifiedOn: z.string().optional(),
			}),
		}),
	}),
};
