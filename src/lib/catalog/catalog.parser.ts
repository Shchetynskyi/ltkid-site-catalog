// src/lib/catalog/catalog.parser.ts
import Papa from 'papaparse';
import type { CatalogItem } from './catalog.types';

type CsvRow = Record<string, unknown>;

function toStringSafe(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

function isTrue(v: unknown): boolean {
  const s = toStringSafe(v).trim().toLowerCase();
  return s === 'true' || s === 'так' || s === '1' || s === 'yes';
}

function toNumberOrNull(v: unknown): number | null {
  const s = toStringSafe(v).trim();
  if (!s) return null;
  const normalized = s.replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function toPrice(v: unknown): number {
  const s = toStringSafe(v).trim();
  if (!s) return 0;
  const cleaned = s.replace(/[^\d.,-]/g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function isVisible(row: CsvRow): boolean {
  return isTrue(row['Показувати']);
}

function hasManufacturerDiopters(row: CsvRow): boolean {
  const raw = row['Наявність діоптрій виробника'];
  const s = toStringSafe(raw).trim();
  return s.length > 0;
}

/**
 * Google Drive "view" links are NOT direct images.
 * Use Drive thumbnail endpoint which returns an actual image response.
 * https://drive.google.com/file/d/<ID>/view -> https://drive.google.com/thumbnail?id=<ID>&sz=w1200
 */
function normalizeImageUrl(raw: unknown): string {
  const url = toStringSafe(raw).trim();
  if (!url) return '';

  const m1 = url.match(/https?:\/\/drive\.google\.com\/file\/d\/([^/]+)\//i);
  if (m1?.[1]) return `https://drive.google.com/thumbnail?id=${m1[1]}&sz=w1200`;

  const m2 = url.match(/https?:\/\/drive\.google\.com\/open\?id=([^&]+)/i);
  if (m2?.[1]) return `https://drive.google.com/thumbnail?id=${m2[1]}&sz=w1200`;

  // if already direct image URL - keep
  return url;
}

export function parseCatalogCsv(csvText: string): CatalogItem[] {
  const parsed = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true
  });

  const rows = (parsed.data ?? []).filter((r) => r && typeof r === 'object');

  const items: CatalogItem[] = [];

  for (const row of rows) {
    if (!isVisible(row)) continue;

    const modelId = toStringSafe(row['ModelID']).trim();
    if (!modelId) continue;

    items.push({
      modelId,
      marketingTitle: toStringSafe(row['Маркетингова назва']).trim(),
      gender: toStringSafe(row['Стать']).trim(),

      previewImage: normalizeImageUrl(row["Прев’ю"]),
      mainImage: normalizeImageUrl(row['Фото (URL)']),

      price: toPrice(row['Price']),

      tryOn: isTrue(row['TryOn']),
      aiPreview: isTrue(row['AIPreview']),

      frameWidth: toNumberOrNull(row['Ширина оправи (мм)']),

      hasManufacturerDiopters: hasManufacturerDiopters(row)
    });
  }

  return items;
}
