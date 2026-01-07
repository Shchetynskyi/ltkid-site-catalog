// src/lib/utils/scroll.ts
import type { Page } from '@sveltejs/kit';

export function galleryScrollKey(page: Page): string {
  return `scroll:${page.url.pathname}${page.url.search}`;
}
