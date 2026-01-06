import type { PageLoad } from './$types';
import { fetchCatalog } from '$lib/catalog/catalog.service';
import { filterByCategoryAndGender } from '$lib/catalog/catalog.selectors';

export const load: PageLoad = async ({ fetch, params }) => {
	const items = await fetchCatalog(fetch);

	const filtered = filterByCategoryAndGender(
		items,
		params.category as any,
		params.gender as any
	);

	return {
		items: filtered
	};
};
