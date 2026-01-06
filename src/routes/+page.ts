import type { PageLoad } from './$types';
import { fetchCatalog } from '$lib/catalog/catalog.service';

export const load: PageLoad = async ({ fetch }) => {
	const items = await fetchCatalog(fetch);
	return { items };
};
