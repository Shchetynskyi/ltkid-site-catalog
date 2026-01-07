// src/lib/catalog/catalog.selectors.ts
import type { CatalogItem } from './catalog.types';

// ====== Public types ======
export type Category = 'ready' | 'frames';
export type Gender = 'жіноча' | 'чоловіча';

// ====== Frame width filter ======
export type FrameWidthRangeKey = 'ALL' | 'S' | 'M' | 'L' | 'XL';

export type FrameWidthRange = {
  key: FrameWidthRangeKey;
  label: string;
  min: number | null;
  max: number | null;
};

export const FRAME_WIDTH_RANGES: readonly FrameWidthRange[] = [
  { key: 'ALL', label: 'Усі', min: null, max: null },
  { key: 'S', label: 'до 130', min: null, max: 130 },
  { key: 'M', label: '131–140', min: 131, max: 140 },
  { key: 'L', label: '141–150', min: 141, max: 150 },
  { key: 'XL', label: 'від 151', min: 151, max: null }
];

// ====== Category helpers ======
export function isReady(item: CatalogItem): boolean {
  return item.hasManufacturerDiopters === true;
}

export function isFrames(item: CatalogItem): boolean {
  return item.hasManufacturerDiopters === false;
}

export function getCategory(item: CatalogItem): Category {
  return isReady(item) ? 'ready' : 'frames';
}

// ====== Gender helpers ======
export type NormalizedGender = 'жіноча' | 'чоловіча' | 'унісекс' | 'unknown';

export function normalizeGender(gender: string): NormalizedGender {
  const g = (gender || '').trim().toLowerCase();
  if (g === 'жіноча') return 'жіноча';
  if (g === 'чоловіча') return 'чоловіча';
  if (g === 'унісекс') return 'унісекс';
  return 'unknown';
}

export function matchesGenderForGallery(
  item: CatalogItem,
  galleryGender: Gender
): boolean {
  const g = normalizeGender(item.gender);
  if (g === 'унісекс') return true;
  return g === galleryGender;
}

// ====== Selectors ======
export function filterByCategoryAndGender(
  items: CatalogItem[],
  category: Category,
  gender: Gender
): CatalogItem[] {
  return items
    .filter((item) => getCategory(item) === category)
    .filter((item) => matchesGenderForGallery(item, gender));
}

// ====== Frame width helpers ======
export function inFrameWidthRange(
  frameWidth: number | null,
  range: FrameWidthRange
): boolean {
  if (frameWidth == null || Number.isNaN(frameWidth)) return false;
  if (range.min != null && frameWidth < range.min) return false;
  if (range.max != null && frameWidth > range.max) return false;
  return true;
}

export type FrameWidthItem = {
  frameWidth?: number | null;
};

export function filterByFrameWidth<T extends FrameWidthItem>(
  items: readonly T[],
  rangeKey: FrameWidthRangeKey
): T[] {
  if (rangeKey === 'ALL') return [...items];

  const range = FRAME_WIDTH_RANGES.find((r) => r.key === rangeKey);
  if (!range) return [...items];

  return items.filter((item) =>
    inFrameWidthRange(item.frameWidth ?? null, range)
  );
}
