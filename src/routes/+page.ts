import type { PageLoad } from './$types';
import { fetchCatalog } from '$lib/catalog/catalog.service';

export const load: PageLoad = async () => {
	const items = await fetchCatalog();

	return {
		items
	};
};
