import { parseCatalogCsv } from './catalog.parser';
import type { CatalogItem } from './catalog.types';

// Catalog CSV source (read-only)
export const CATALOG_CSV_URL =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vRY7VLZvFgVUk1AslbRRmEtmhIVHFPK5jApKT4GjpQuLN-eJ45_fs3r2v8UXisxYdVsXYXl_wsEwoo9/pub?gid=51481216&single=true&output=csv';

export async function fetchCatalogRaw(fetchFn: typeof fetch): Promise<string> {
	const res = await fetchFn(CATALOG_CSV_URL);
	if (!res.ok) {
		throw new Error('Failed to fetch catalog CSV');
	}
	return res.text();
}

export async function fetchCatalog(fetchFn: typeof fetch): Promise<CatalogItem[]> {
	const csv = await fetchCatalogRaw(fetchFn);
	return parseCatalogCsv(csv);
}
