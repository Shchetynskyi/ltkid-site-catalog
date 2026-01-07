// src/lib/home/home.config.ts
import type { Category, Gender } from '$lib/catalog/catalog.selectors';

export interface HomeCardConfig {
  readonly category: Category;
  readonly gender: Gender;
}

export const HOME_CARDS: readonly HomeCardConfig[] = [
  { category: 'ready', gender: 'жіноча' },
  { category: 'ready', gender: 'чоловіча' },
  { category: 'frames', gender: 'жіноча' },
  { category: 'frames', gender: 'чоловіча' }
];
