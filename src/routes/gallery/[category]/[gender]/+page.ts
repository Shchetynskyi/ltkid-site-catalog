// src/routes/gallery/[category]/[gender]/+page.ts
import type { PageLoad } from './$types';
import { fetchCatalog } from '$lib/catalog/catalog.service';
import {
  filterByCategoryAndGender,
  type Category,
  type Gender
} from '$lib/catalog/catalog.selectors';

export const load: PageLoad = async ({ fetch, params }) => {
  const items = await fetchCatalog(fetch);

  const category = params.category as Category;
  const gender = params.gender as Gender;

  const filtered = filterByCategoryAndGender(items, category, gender);

  const mapped = filtered.map((i) => ({
    modelId: i.modelId,
    marketingTitle: i.marketingTitle,
    previewImage: i.previewImage,
    SitePriceUAH: (i as any).SitePriceUAH ?? '',
    frameWidth: i.frameWidth ?? null
  }));

  return { items: mapped };
};
