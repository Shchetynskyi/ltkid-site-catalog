import type { Page } from '@sveltejs/kit';

export function galleryScrollKey(page: Page) {
  return `scroll:${page.url.pathname}${page.url.search}`;
}
