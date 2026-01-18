// src/routes/gallery/[category]/[gender]/+page.ts
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import {
  filterByCategoryAndGender,
  type Category,
  type Gender
} from '$lib/catalog/catalog.selectors';
import { MANAGER_MESSENGER_URL } from '$lib/config/links';

function normalizeBase(raw: string): string {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return 'https://m.me/101402489688578';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

function buildMessengerUrlWithDiopter(diopter: string): string {
  const base = normalizeBase(MANAGER_MESSENGER_URL);
  const url = new URL(base);

  // Canonical safe fallback (Phase 2 behavior)
  url.searchParams.set('ref', 'site_catalog__from_site');
  url.searchParams.set('DiopterContext', diopter);

  return url.toString();
}

// Extract ONLY tokens like +3.00 / -0.75 from possibly noisy strings
const DIO_RE = /[+-]\d+(?:\.\d{2})/g;

function extractDiopters(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const matches = raw.match(DIO_RE);
  return matches ?? [];
}

function diopterContains(values: string | null | undefined, d: string): boolean {
  return extractDiopters(values).includes(d);
}

export const load: PageLoad = async ({ params, parent, url }) => {
  console.time('[P3] load total');

  console.time('[P3] parent()');
  const { catalog } = await parent();
  console.timeEnd('[P3] parent()');

  const category = params.category as Category;
  const gender = params.gender as Gender;

  const activeRange = url.searchParams.get('w') ?? 'ALL';
  const diopter = (url.searchParams.get('diopter') ?? '').trim() || null;
  const isReady = category === 'ready';

  console.time('[P3] filterByCategoryAndGender');
  const filtered = filterByCategoryAndGender(catalog, category, gender);
  console.timeEnd('[P3] filterByCategoryAndGender');

  // NOTE: width filter remains in +page.svelte (existing behavior).
  // Here we ONLY enforce Phase 3 rule: when ready + diopter present and there are ZERO matches,
  // redirect immediately BEFORE page mounts.

  if (isReady && diopter) {
    console.time('[P3] diopter precheck');
    let hasAny = false;
    for (const it of filtered) {
      // width filter is not applied here; even without it, if diopter has zero matches,
      // it will stay zero after width filtering too. This keeps correctness.
      if (diopterContains((it as any).DiopterValues ?? null, diopter)) {
        hasAny = true;
        break;
      }
    }
    console.timeEnd('[P3] diopter precheck');

    if (!hasAny) {
      console.timeEnd('[P3] load total');
      throw redirect(302, buildMessengerUrlWithDiopter(diopter));
    }
  }

  console.time('[P3] map items');
  const mapped = filtered.map((i) => ({
    modelId: i.modelId,
    marketingTitle: i.marketingTitle,

    // IMPORTANT: pass same field as model page uses
    mainImage: (i as any).mainImage ?? null,

    // keep existing field (might be used elsewhere)
    previewImage: (i as any).previewImage ?? null,

    SitePriceUAH: (i as any).SitePriceUAH ?? '',
    frameWidth: i.frameWidth ?? null,
    DiopterValues: (i as any).DiopterValues ?? null
  }));
  console.timeEnd('[P3] map items');

  console.timeEnd('[P3] load total');

  // keep signature unchanged
  return { items: mapped, _w: activeRange };
};
