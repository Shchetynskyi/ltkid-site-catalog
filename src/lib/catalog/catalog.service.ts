// src/lib/catalog/catalog.service.ts
import { parseCatalogCsv } from './catalog.parser';
import type { CatalogItem } from './catalog.types';

// Catalog CSV source (read-only)
export const CATALOG_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRY7VLZvFgVUk1AslbRRmEtmhIVHFPK5jApKT4GjpQuLN-eJ45_fs3r2v8UXisxYdVsXYXl_wsEwoo9/pub?gid=51481216&single=true&output=csv';

function withCacheBuster(url: string, enabled: boolean): string {
  if (!enabled) return url;
  const ts = Date.now().toString();
  return url.includes('?') ? `${url}&ts=${ts}` : `${url}?ts=${ts}`;
}

export async function fetchCatalogRaw(
  fetchFn: typeof fetch,
  opts?: { forceFresh?: boolean }
): Promise<string> {
  const url = withCacheBuster(CATALOG_CSV_URL, !!opts?.forceFresh);

  const res = await fetchFn(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch catalog CSV: ${res.status}`);
  }
  return res.text();
}

export async function fetchCatalog(
  fetchFn: typeof fetch,
  opts?: { forceFresh?: boolean }
): Promise<CatalogItem[]> {
  // Always fetch fresh on the client to reflect Google Sheet changes without dev-server restart.
  const csv = await fetchCatalogRaw(fetchFn, { forceFresh: true });
  return parseCatalogCsv(csv);
}