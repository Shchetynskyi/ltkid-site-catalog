// src/routes/model/[modelId]/+page.ts
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { CatalogItem } from '$lib/catalog/catalog.types';

function safeDecodeOnce(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

function normalizeFrom(raw: string | null): string | null {
  if (!raw) return null;

  const d1 = safeDecodeOnce(raw);
  const d2 = safeDecodeOnce(d1);

  const candidate = d2.startsWith('/gallery/') ? d2 : d1.startsWith('/gallery/') ? d1 : null;
  if (!candidate) return null;

  if (/^https?:\/\//i.test(candidate)) return null;

  return candidate;
}

function buildRedirectTarget(path: string, noticeValue: string): string {
  const u = new URL(path, 'http://local');
  u.searchParams.set('notice', noticeValue);
  return u.pathname + u.search;
}

export const load: PageLoad = async ({ params, url, parent }) => {
  const { catalog } = (await parent()) as { catalog: CatalogItem[] };

  const item = catalog.find((i) => i.modelId === params.modelId) ?? null;

  if (!item) {
    const from = normalizeFrom(url.searchParams.get('from'));

    const target = from
      ? buildRedirectTarget(from, 'model_not_found')
      : buildRedirectTarget('/gallery/frames/unisex', 'model_not_found');

    throw redirect(302, target);
  }

  return { item };
};
