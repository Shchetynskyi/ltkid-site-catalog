// src/lib/catalog/catalog.selectors.ts
import type { CatalogItem } from './catalog.types';

// ====== Public types (used by routes) ======
export type Category = 'ready' | 'frames';
export type Gender = 'жіноча' | 'чоловіча' | 'унісекс';

// ====== Frame width filter (PUBLIC CONTRACT) ======
export type FrameWidthRangeKey = 'ALL' | 'LT_130' | 'R_131_140' | 'R_141_150' | 'GTE_151';

export type FrameWidthItem = {
  frameWidth: number | null;
};

export type FrameWidthRange = {
  key: FrameWidthRangeKey;
  label: string;
  min: number | null; // inclusive
  max: number | null; // inclusive
};

export const FRAME_WIDTH_RANGES: readonly FrameWidthRange[] = [
  { key: 'ALL', label: 'Усі', min: null, max: null },
  { key: 'LT_130', label: 'до 130', min: null, max: 130 },
  { key: 'R_131_140', label: '131–140', min: 131, max: 140 },
  { key: 'R_141_150', label: '141–150', min: 141, max: 150 },
  { key: 'GTE_151', label: 'від 151', min: 151, max: null }
];

function isNumber(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

function inRange(value: number, range: FrameWidthRange): boolean {
  const { min, max } = range;
  if (min == null && max == null) return true;
  if (min == null) return value <= (max as number);
  if (max == null) return value >= min;
  return value >= min && value <= max;
}

export function filterByFrameWidth<T extends FrameWidthItem>(
  items: T[],
  rangeKey: FrameWidthRangeKey
): T[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  if (rangeKey === 'ALL') return items;

  const range = FRAME_WIDTH_RANGES.find((r) => r.key === rangeKey);
  if (!range) return items;

  return items.filter((item) => {
    const w = item.frameWidth;
    if (!isNumber(w)) return false;
    return inRange(w, range);
  });
}

// ====== Category / Gender filter ======
function norm(s: unknown): string {
  return typeof s === 'string' ? s.trim().toLowerCase() : '';
}

function parseCategory(v: unknown): Category {
  const s = norm(v);
  if (s === 'ready') return 'ready';
  if (s === 'frames') return 'frames';
  return 'ready';
}

// ====== SSOT RULE ======
// READY  = DiopterValues NOT empty
// FRAMES = DiopterValues empty
function hasReadyDiopters(i: CatalogItem): boolean {
  return typeof i.DiopterValues === 'string' && i.DiopterValues.trim() !== '';
}

function isUnisexValue(v: string): boolean {
  const s = norm(v);
  return s === 'унісекс' || s === 'unisex' || s === 'унисекс';
}

function isFemaleValue(v: string): boolean {
  const s = norm(v);
  return s === 'жіноча' || s === 'женская' || s === 'female' || s === 'w';
}

function isMaleValue(v: string): boolean {
  const s = norm(v);
  return s === 'чоловіча' || s === 'мужская' || s === 'male' || s === 'm';
}

export function filterByCategoryAndGender(
  items: CatalogItem[],
  categoryParam: string,
  genderParam: string
): CatalogItem[] {
  const c = parseCategory(categoryParam);
  const g = norm(genderParam);

  const byCategory =
    c === 'ready'
      ? items.filter((i) => hasReadyDiopters(i))
      : items.filter((i) => !hasReadyDiopters(i));

  if (g === 'унісекс' || g === 'unisex' || g === 'унисекс') {
    return byCategory.filter((i) => isUnisexValue(i.gender));
  }

  if (g === 'жіноча' || g === 'женская' || g === 'female' || g === 'w') {
    return byCategory.filter((i) => isFemaleValue(i.gender) || isUnisexValue(i.gender));
  }

  if (g === 'чоловіча' || g === 'мужская' || g === 'male' || g === 'm') {
    return byCategory.filter((i) => isMaleValue(i.gender) || isUnisexValue(i.gender));
  }

  return byCategory;
}
