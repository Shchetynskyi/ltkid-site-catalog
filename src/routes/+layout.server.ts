// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { fetchCatalog } from '$lib/catalog/catalog.service';

export const load: LayoutServerLoad = async ({ fetch, depends }) => {
  depends('app:catalog');

  const catalog = await fetchCatalog(fetch, { forceFresh: false });

  return { catalog };
};