// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { fetchCatalog } from '$lib/catalog/catalog.service';
import type { CatalogItem } from '$lib/catalog/catalog.types';

type Cache = {
  at: number;
  catalog: CatalogItem[];
};

let cache: Cache | null = null;
const TTL_MS = 10 * 60 * 1000; // 10 хв

export const load: LayoutServerLoad = async ({ fetch }) => {
  const now = Date.now();

  if (cache && now - cache.at < TTL_MS) {
    return { catalog: cache.catalog };
  }

  const catalog = await fetchCatalog(fetch);

  cache = { at: now, catalog };

  return { catalog };
};
