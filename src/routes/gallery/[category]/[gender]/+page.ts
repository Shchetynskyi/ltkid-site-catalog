// src/routes/gallery/[category]/[gender]/+page.ts
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import {
  filterByCategoryAndGender,
  modelSupportsDiopter,
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

  const refParts = [`mid=CATALOG`, `t=CATALOG`, `p=—`, `d=${diopter}`];
  url.searchParams.set('ref', refParts.join('|'));

  const text =
    `З моїми лінзами не знайшлося готових окулярів у каталозі.\n` +
    `Потрібна допомога менеджера.\n\n` +
    `Мої лінзи (+/-): ${diopter}\n\n` +
    `Натисніть «НАДІСЛАТИ», щоб менеджер отримав ваше звернення.`;

  url.searchParams.set('text', text);

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
  const rawDiopter = url.searchParams.get('diopter') ?? '';
  const diopter = rawDiopter.replace(/\s+/g, '').trim() || null;

  const isReady = category === 'ready';

  console.time('[P3] filterByCategoryAndGender');
  const filtered = filterByCategoryAndGender(catalog, category, gender);

  const returnModelId = url.searchParams.get('returnModelId');

  if (isReady && diopter && returnModelId) {
    const model = filtered.find((i) => i.modelId === returnModelId);
    if (model && modelSupportsDiopter(model as any, diopter)) {
      const from = encodeURIComponent(url.pathname + url.search);

      throw redirect(
        302,
        `/model/${encodeURIComponent(returnModelId)}?diopter=${encodeURIComponent(diopter)}&from=${from}`
      );
    }
  }

  console.timeEnd('[P3] filterByCategoryAndGender');

  if (isReady && diopter) {
    console.time('[P3] diopter precheck');
    let hasAny = false;
    for (const it of filtered) {
      if (modelSupportsDiopter(it as any, diopter)) {
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
  const filteredSorted = [...filtered].sort((a, b) => {
  const pa = (a as any).priority ?? 999;
  const pb = (b as any).priority ?? 999;

  if (pa !== pb) return pa - pb;

  return (a as any).marketingTitle?.localeCompare((b as any).marketingTitle ?? '') 
    || a.modelId.localeCompare(b.modelId);
});
const mapped = filteredSorted.map((i) => ({
    modelId: i.modelId,
    marketingTitle: i.marketingTitle,

    mainImage: i.mainImage,
previewImage: i.previewImage,

    SitePriceUAH: (i as any).SitePriceUAH ?? '',
    frameWidth: i.frameWidth ?? null,
    DiopterValues: (i as any).DiopterValues ?? null,

    TypeLens: (i as any).TypeLens ?? null,
    priority: (i as any).priority ?? null
  }));

  console.timeEnd('[P3] map items');
  console.timeEnd('[P3] load total');

  return { items: mapped, _w: activeRange };
};