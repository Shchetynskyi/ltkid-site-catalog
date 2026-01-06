// Catalog CSV source (read-only)
export const CATALOG_CSV_URL =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vRY7VLZvFgVUk1AslbRRmEtmhIVHFPK5jApKT4GjpQuLN-eJ45_fs3r2v8UXisxYdVsXYXl_wsEwoo9/pub?gid=51481216&single=true&output=csv';

// Заглушка сервісу — реалізація далі
export async function fetchCatalogRaw(): Promise<string> {
	const res = await fetch(CATALOG_CSV_URL);
	if (!res.ok) {
		throw new Error('Failed to fetch catalog CSV');
	}
	return res.text();
}
import { parseCatalogCsv } from './catalog.parser';
import type { CatalogItem } from './catalog.types';

export async function fetchCatalog(): Promise<CatalogItem[]> {
	const csv = await fetchCatalogRaw();
	return parseCatalogCsv(csv);
}
