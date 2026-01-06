import type { Category, Gender } from '$lib/catalog/catalog.selectors';

export interface HomeCardConfig {
	category: Category;
	gender: Gender;
}

export const HOME_CARDS: HomeCardConfig[] = [
	{ category: 'ready', gender: 'жіноча' },
	{ category: 'ready', gender: 'чоловіча' },
	{ category: 'frames', gender: 'жіноча' },
	{ category: 'frames', gender: 'чоловіча' }
];
