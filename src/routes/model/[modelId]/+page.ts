// src/routes/model/[modelId]/+page.ts
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { fetchCatalog } from '$lib/catalog/catalog.service';

export const load: PageLoad = async ({ fetch, params, url }) => {
  const items = await fetchCatalog(fetch);
  const item = items.find((i) => i.modelId === params.modelId) ?? null;

  if (!item) {
    const rawFrom = url.searchParams.get('from');

    let from: string | null = null;
    if (rawFrom) {
      try {
        const decoded = decodeURIComponent(rawFrom);
        if (decoded.startsWith('/gallery/')) from = decoded;
      } catch {
        from = null;
      }
    }

    const target = from
      ? `${from}${from.includes('?') ? '&' : '?'}notice=model_not_found`
      : `/gallery/frames/unisex?notice=model_not_found`;

    throw redirect(302, target);
  }

  return { item };
};
