// src/routes/model/[modelId]/+page.ts
import type { PageLoad } from './$types';
import { fetchCatalog } from '$lib/catalog/catalog.service';

export const load: PageLoad = async ({ fetch, params }) => {
  const items = await fetchCatalog(fetch);
  const item = items.find((i) => i.modelId === params.modelId) ?? null;

  return { item };
};
