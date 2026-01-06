import type { PageLoad } from './$types';
import { fetchCatalog } from '$lib/catalog/catalog.service';
import { HOME_CARDS } from '$lib/home/home.config';

export const load: PageLoad = async ({ fetch }) => {
	const items = await fetchCatalog(fetch);

	return {
		items,
		cards: HOME_CARDS
	};
};
