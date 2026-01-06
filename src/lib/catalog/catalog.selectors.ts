// src/lib/catalog/catalog.selectors.ts
import type { CatalogItem } from './catalog.types';

export type Category = 'ready' | 'frames';
export type Gender = 'жіноча' | 'чоловіча';

export function isReady(item: CatalogItem): boolean {
  // SPEC v1.2: ready = є діоптрії виробника
  return item.hasManufacturerDiopters === true;
}

export function filterByCategoryAndGender(
  items: CatalogItem[],
  category: Category,
  gender: Gender
): CatalogItem[] {
  return items.filter((item) => {
    const genderMatch =
      item.gender === gender || item.gender === 'унісекс';

    const categoryMatch =
      category === 'ready' ? isReady(item) : !isReady(item);

    return genderMatch && categoryMatch;
  });
}
