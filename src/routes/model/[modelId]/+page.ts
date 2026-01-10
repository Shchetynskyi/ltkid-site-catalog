// src/routes/model/[modelId]/+page.ts
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { fetchCatalog } from '$lib/catalog/catalog.service';

function safeDecodeOnce(input: string): string {
  try {
    return decodeURIComponent(input);
  } catch {
    return input;
  }
}

function normalizeFrom(raw: string | null): string | null {
  if (!raw) return null;

  // decode at most twice to handle double-encoded values (%25D0%25... -> %D0%... -> ...)
  const d1 = safeDecodeOnce(raw);
  const d2 = safeDecodeOnce(d1);

  const candidate = d2.startsWith('/gallery/') ? d2 : d1.startsWith('/gallery/') ? d1 : null;
  if (!candidate) return null;

  // strict safety: never allow absolute URLs
  if (/^https?:\/\//i.test(candidate)) return null;

  return candidate;
}

function buildRedirectTarget(path: string, noticeValue: string): string {
  // URL will produce a valid ASCII/percent-encoded pathname+search suitable for Location header
  const u = new URL(path, 'http://local');
  u.searchParams.set('notice', noticeValue);
  return u.pathname + u.search;
}

export const load: PageLoad = async ({ fetch, params, url }) => {
  const items = await fetchCatalog(fetch);
  const item = items.find((i) => i.modelId === params.modelId) ?? null;

  if (!item) {
    const from = normalizeFrom(url.searchParams.get('from'));

    const target = from
      ? buildRedirectTarget(from, 'model_not_found')
      : buildRedirectTarget('/gallery/frames/unisex', 'model_not_found');

    throw redirect(302, target);
  }

  return { item };
};
