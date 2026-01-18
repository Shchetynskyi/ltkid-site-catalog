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

// Client-side memo (per session). Server caching is handled in +layout.server.ts.
let catalogPromise: Promise<CatalogItem[]> | null = null;

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
  const forceFresh = !!opts?.forceFresh;

  if (!forceFresh) {
    if (!catalogPromise) {
      catalogPromise = (async () => {
        const csv = await fetchCatalogRaw(fetchFn, { forceFresh: false });
        return parseCatalogCsv(csv);
      })().catch((err) => {
        // allow retry on next call if initial attempt failed
        catalogPromise = null;
        throw err;
      });
    }
    return catalogPromise;
  }

  const csv = await fetchCatalogRaw(fetchFn, { forceFresh: true });
  return parseCatalogCsv(csv);
}
