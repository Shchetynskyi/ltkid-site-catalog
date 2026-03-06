// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { fetchCatalog } from '$lib/catalog/catalog.service';
import type { CatalogItem } from '$lib/catalog/catalog.types';

type Cache = {
  at: number;
  catalog: CatalogItem[];
};

let cache: Cache | null = null;
const TTL_MS = import.meta.env.DEV ? 10 * 1000 : 10 * 60 * 1000;

export const load: LayoutServerLoad = async ({ fetch, url }) => {
  const now = Date.now();
  const forceFresh = url.searchParams.has('refresh');

  if (!forceFresh && cache && now - cache.at < TTL_MS) {
    return { catalog: cache.catalog };
  }

  const catalog = await fetchCatalog(fetch, { forceFresh });

  cache = { at: now, catalog };

  return { catalog };
};