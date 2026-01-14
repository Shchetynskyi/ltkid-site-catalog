// src/lib/catalog/catalog.parser.ts
import Papa from 'papaparse';
import type { CatalogItem } from './catalog.types';

type CsvRow = Record<string, string>;

function toStringSafe(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

function toBoolean(v: unknown): boolean {
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
  return toBoolean(row['Показувати']);
}

function hasManufacturerDiopters(row: CsvRow): boolean {
  return toBoolean(row['Наявність діоптрій виробника']);
}

function extractDriveFileId(url: string): string | null {
  const m1 = url.match(/https?:\/\/drive\.google\.com\/file\/d\/([^/]+)\//i);
  if (m1?.[1]) return m1[1];
  const m2 = url.match(/https?:\/\/drive\.google\.com\/open\?id=([^&]+)/i);
  if (m2?.[1]) return m2[1];
  const m3 = url.match(/https?:\/\/drive\.google\.com\/uc\?.*?\bid=([^&]+)/i);
  if (m3?.[1]) return m3[1];
  const m4 = url.match(/\bid=([^&]+)/i);
  if (m4?.[1] && /drive\.google\.com/i.test(url)) return m4[1];
  return null;
}

function normalizeImageUrl(raw: unknown): string {
  const url = toStringSafe(raw).trim();
  if (!url) return '';
  if (/^https?:\/\/drive\.google\.com\/thumbnail\?/i.test(url)) return url;
  if (/^https?:\/\/lh3\.googleusercontent\.com\//i.test(url)) return url;
  const id = extractDriveFileId(url);
  if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
  return url;
}

export function parseCatalogCsv(csvText: string): CatalogItem[] {
  const parsed = Papa.parse<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
    dynamicTyping: false,
    transformHeader: (h) => h.trim()
  });

  const rows = (parsed.data ?? [])
    .filter((r): r is Record<string, unknown> => !!r && typeof r === 'object')
    .map((r) => {
      const out: CsvRow = {};
      for (const [k, v] of Object.entries(r)) out[k] = toStringSafe(v);
      return out;
    });

  const items: CatalogItem[] = [];

  for (const row of rows) {
    if (!isVisible(row)) continue;

    const modelId = row['ModelID']?.trim() ?? '';
    if (!modelId) continue;

    items.push({
      modelId,
      marketingTitle: (row['Маркетингова назва'] ?? '').trim(),
      gender: (row['Стать'] ?? '').trim(),

      previewImage: normalizeImageUrl(row['Прев’ю']),
      mainImage: normalizeImageUrl(row['Фото (URL)']),

      price: toPrice(row['Price']),

      tryOn: toBoolean(row['TryOn']),
      aiPreview: toBoolean(row['AIPreview']),

      frameWidth: toNumberOrNull(row['Ширина оправи (мм)']),
      frameHeight: toNumberOrNull(row['Висота оправи (мм)']),

      // 🔑 SSOT: READY визначається тут
      DiopterValues: (row['DiopterValues'] ?? '').trim(),

      // legacy (більше не використовується для READY)
      hasManufacturerDiopters: hasManufacturerDiopters(row)
    });
  }

  return items;
}
