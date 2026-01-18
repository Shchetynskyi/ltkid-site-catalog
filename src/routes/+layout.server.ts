// src/routes/+layout.server.ts
import type { LayoutLoad } from './$types';
import { fetchCatalog } from '$lib/catalog/catalog.service';

type Cache = {
  at: number;
  catalog: unknown;
};

let cache: Cache | null = null;
const TTL_MS = 10 * 60 * 1000; // 10 хв

export const load: LayoutLoad = async ({ fetch }) => {
  const now = Date.now();

  if (cache && now - cache.at < TTL_MS) {
    return { catalog: cache.catalog as any };
  }

  const catalog = await fetchCatalog(fetch);

  cache = { at: now, catalog };

  return { catalog };
};
