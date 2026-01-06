import type { CatalogItem } from './catalog.types';

export type Category = 'ready' | 'frames';
export type Gender = 'жіноча' | 'чоловіча';

export function isReady(item: CatalogItem): boolean {
	// Готові окуляри визначаються на рівні імпорту даних,
	// тут поки заглушка — реалізація після узгодження діоптрій
	return true;
}

export function filterByCategoryAndGender(
	items: CatalogItem[],
	category: Category,
	gender: Gender
): CatalogItem[] {
	return items.filter((item) => {
		const genderMatch =
			item.gender === gender || item.gender === 'унісекс';

		if (!genderMatch) return false;

		if (category === 'ready') return isReady(item);
		return !isReady(item);
	});
}
