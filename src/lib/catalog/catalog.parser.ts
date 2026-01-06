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

  // allow "140,5" and "140.5"
  const normalized = s.replace(',', '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

function toPrice(v: unknown): number {
  const s = toStringSafe(v).trim();
  if (!s) return 0;

  // keep digits, comma, dot
  const cleaned = s.replace(/[^\d.,-]/g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function isVisible(row: CsvRow): boolean {
  // SPEC v1.1: Показувати = "Так" OR TRUE
  return isTrue(row['Показувати']);
}

function hasManufacturerDiopters(row: CsvRow): boolean {
  // SPEC v1.2: ONLY факт непорожнього поля
  const raw = row['Наявність діоптрій виробника'];
  const s = toStringSafe(raw).trim();
  return s.length > 0;
}

export function parseCatalogCsv(csvText: string): CatalogItem[] {
  const parsed = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: true
  });

  if (parsed.errors?.length) {
    // не падаємо, просто повертаємо те, що змогли
    // (логування — пізніше, щоб не шуміти в проді)
  }

  const rows = (parsed.data ?? []).filter((r) => r && typeof r === 'object');

  const items: CatalogItem[] = [];

  for (const row of rows) {
    if (!isVisible(row)) continue;

    const modelId = toStringSafe(row['ModelID']).trim();
    if (!modelId) continue; // без ModelID — рядок непридатний

    const item: CatalogItem = {
      modelId,
      marketingTitle: toStringSafe(row['Маркетингова назва']).trim(),
      gender: toStringSafe(row['Стать']).trim(),

      previewImage: toStringSafe(row["Прев’ю"]).trim(),
      mainImage: toStringSafe(row['Фото (URL)']).trim(),

      price: toPrice(row['Price']),

      tryOn: isTrue(row['TryOn']),
      aiPreview: isTrue(row['AIPreview']),

      frameWidth: toNumberOrNull(row['Ширина оправи (мм)']),

      // v1.2
      hasManufacturerDiopters: hasManufacturerDiopters(row)
    };

    items.push(item);
  }

  return items;
}
