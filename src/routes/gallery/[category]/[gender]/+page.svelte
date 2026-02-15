<!-- src/routes/gallery/[category]/[gender]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount, tick } from 'svelte';
  import { browser } from '$app/environment';

  import {
    FRAME_WIDTH_RANGES,
    type FrameWidthRangeKey,
    filterByFrameWidth,
    type FrameWidthItem
  } from '$lib/catalog/catalog.selectors';
  import { galleryScrollKey } from '$lib/utils/scroll';
  import { MANAGER_MESSENGER_URL } from '$lib/config/links';
  import { getPublicModelId } from "$lib/catalog/publicModelId";
  import { getLensTypeLabel } from "$lib/catalog/lensTypeLabel";
  import { getLensTypeVendorTag } from "$lib/catalog/lensTypeVendorTag";




  type GalleryItem = FrameWidthItem & {
  modelId: string;
  marketingTitle: string;

  // IMPORTANT: use same image field as model page
  mainImage?: string;

  SitePriceUAH?: string | number | null;

  // Phase 3 (ready-only)
  DiopterValues?: string | null;

  TypeLens?: string | null;
};


  export let data: { items: GalleryItem[] };

  function getPriceLabel(value: unknown): string {
    const n =
      typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? Number(value.trim().replace(',', '.'))
          : NaN;

    if (!Number.isFinite(n) || n <= 0) {
      return 'Ціну уточнюйте';
    }

    return `${n} грн`;
  }

  function readRangeFromUrl(): FrameWidthRangeKey {
    const v = $page.url.searchParams.get('w');
    if (!v) return 'ALL';
    return FRAME_WIDTH_RANGES.some((r) => r.key === v) ? (v as FrameWidthRangeKey) : 'ALL';
  }

  function readNoticeFromUrl(): string | null {
    return $page.url.searchParams.get('notice');
  }

  // Phase 3: diopter comes ONLY from explicit diopter flow
  function readDiopterFromUrl(): string | null {
    const v = $page.url.searchParams.get('diopter');
    if (!v) return null;
    const t = v.trim();
    return t ? t : null;
  }

  function isReadyCategory(): boolean {
    return $page.params.category === 'ready';
  }

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




  // PERF: pre-index diopters per item once (avoid regex per item per render)
  const DIO_RE = /[+-]\d+(?:\.\d{2})/g;

  function buildDiopterSet(raw: string | null | undefined): Set<string> {
    const set = new Set<string>();
    if (!raw) return set;
    const matches = raw.match(DIO_RE);
    if (!matches) return set;
    for (const m of matches) set.add(m);
    return set;
  }

  let diopterIndex = new Map<string, Set<string>>();
  let singleColumn = true;


  $: {
    // rebuild index only when items change
    const next = new Map<string, Set<string>>();
    for (const item of data.items) {
      next.set(item.modelId, buildDiopterSet(item.DiopterValues ?? null));
    }
    diopterIndex = next;
  }

  function diopterContains(modelId: string, d: string): boolean {
    return diopterIndex.get(modelId)?.has(d) ?? false;
  }

  let activeRange: FrameWidthRangeKey = readRangeFromUrl();
  let notice: string | null = readNoticeFromUrl();

  $: {
    const nextNotice = readNoticeFromUrl();
    if (nextNotice !== notice) notice = nextNotice;
  }

  $: diopter = readDiopterFromUrl();

  $: returnUrl = $page.url.searchParams.get('return')?.trim() || null;

  $: returnModelId = $page.url.searchParams.get('returnModelId')?.trim() || null;



  // base width filter (existing behavior)
  $: widthFiltered = filterByFrameWidth(data.items, activeRange);

  // Phase 3 diopter filter (ready-only)
  $: visibleItems =
    isReadyCategory() && diopter
      ? widthFiltered.filter((item) => diopterContains(item.modelId, diopter))
      : widthFiltered;

  function setRange(key: FrameWidthRangeKey): void {
    activeRange = key;

    const url = new URL($page.url);
    if (key === 'ALL') url.searchParams.delete('w');
    else url.searchParams.set('w', key);

    goto(url.pathname + url.search, { replaceState: true, noScroll: true });
  }

  function showAll(): void {
    setRange('ALL');
  }

  function onKeyActivate(e: KeyboardEvent, fn: () => void): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  }

  function readSavedY(key: string): number | null {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    try {
      const v = JSON.parse(raw) as { y?: number };
      return typeof v?.y === 'number' ? v.y : null;
    } catch {
      return null;
    }
  }

  function writeSavedY(key: string): void {
    sessionStorage.setItem(key, JSON.stringify({ y: window.scrollY, t: Date.now() }));
  }

  async function restoreSavedY(key: string): Promise<void> {
    const y = readSavedY(key);
    if (y == null) return;
    await tick();
    window.scrollTo({ top: y, left: 0, behavior: 'auto' });
  }

  function shouldAutoMessenger(): boolean {
    return isReadyCategory() && !!diopter && visibleItems.length === 0;
  }

  // neutral visual fallback (no "broken image" state)
  function initialsFromTitle(title: string, modelId: string): string {
    const t = (title || '').trim();
    if (!t) return (modelId || '').slice(0, 2).toUpperCase();
    const parts = t.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? '';
    const b = parts[1]?.[0] ?? '';
    const s = (a + b) || parts[0]?.slice(0, 2) || modelId?.slice(0, 2) || 'OK';
    return s.toUpperCase();
  }

  onMount(() => {
    if (!browser) return;

    activeRange = readRangeFromUrl();

    const onPopState = (): void => {
      activeRange = readRangeFromUrl();
    };
    window.addEventListener('popstate', onPopState);

    const url = new URL($page.url);
    const n = url.searchParams.get('notice');
    if (n === 'model_not_found' && url.searchParams.has('w')) {
      url.searchParams.delete('w');
      activeRange = 'ALL';
      goto(url.pathname + url.search, { replaceState: true, noScroll: true });
    }

    let currentKey = galleryScrollKey($page);

    restoreSavedY(currentKey);

    const onScroll = (): void => writeSavedY(currentKey);
    const onBeforeUnload = (): void => writeSavedY(currentKey);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('beforeunload', onBeforeUnload);

    const unsub = page.subscribe(($p) => {
      currentKey = galleryScrollKey($p);
    });

    // Phase 3: empty gallery forbidden when diopter context active
    if (shouldAutoMessenger() && diopter) {
      Promise.resolve().then(() => {
        window.location.href = buildMessengerUrlWithDiopter(diopter);
      });
    }

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('beforeunload', onBeforeUnload);
      unsub();
    };
  });
</script>

<section class="gallery">
{#if returnModelId && diopter && !visibleItems.some(item => item.modelId === returnModelId)}
  <div class="notice">
    Цієї моделі немає для {diopter}. Ось інші варіанти.
  </div>
{/if}




  <div class="gallery-toolbar">
  <div class="filter-header">
    <div class="filter-label">Ширина оправи (мм)</div>

    {#each FRAME_WIDTH_RANGES as r (r.key)}
      {#if r.key === 'ALL'}
        <div
          role="button"
          tabindex="0"
          class="filter-item filter-item--header"

          class:selected={activeRange === r.key}
          aria-pressed={activeRange === r.key}
          on:click={() => setRange(r.key)}
          on:keydown={(e) => onKeyActivate(e, () => setRange(r.key))}
        >
          {r.label}
        </div>
      {/if}
    {/each}
  </div>





    <div class="filters" aria-label="Фільтр ширини оправи">
  {#each FRAME_WIDTH_RANGES as r (r.key)}
    {#if r.key !== 'ALL'}
      <div
        role="button"
        tabindex="0"
        class="filter-item"
        class:selected={activeRange === r.key}
        aria-pressed={activeRange === r.key}
        on:click={() => setRange(r.key)}
        on:keydown={(e) => onKeyActivate(e, () => setRange(r.key))}
      >
        {r.label}
      </div>
    {/if}
  {/each}
</div>




    <div class="toolbar-row">
  <div class="results-count">
    Показано: <strong>{visibleItems.length}</strong>
  </div>

  <button
  type="button"
  class="view-toggle"
  on:click={() => (singleColumn = !singleColumn)}
>
  {singleColumn ? 'Показати 2 колонки' : 'Показати 1 колонку'}



</button>



      
    </div>
  </div>

  {#if visibleItems.length === 0}
    {#if isReadyCategory() && diopter}
      <!-- Phase 3: empty gallery forbidden; auto-redirect happens onMount -->
      <div style="display:none;"></div>
    {:else}
      <div class="empty">
        <div class="empty-title">Нічого не знайденно</div>
        <div class="empty-text">
          Спробуйте інший діапазон ширини або покажіть усі моделі.
        </div>
        <div
          role="button"
          tabindex="0"
          class="empty-btn"
          on:click={showAll}
          on:keydown={(e) => onKeyActivate(e, showAll)}
        >
          Показати всі
        </div>
      </div>
    {/if}
  {:else}
    <div
  class="gallery-grid"
  class:single={singleColumn}
  aria-label="Галерея моделей"
>

     {#each visibleItems as item (item.modelId)}
  <a
    class="product-card"
    href={
      returnUrl && item.modelId === returnUrl.split('/model/')[1]
        ? `${returnUrl}?diopter=${encodeURIComponent(diopter!)}`
        : `/model/${encodeURIComponent(item.modelId)}?${new URLSearchParams({
            ...(diopter ? { diopter } : {}),
            from: $page.url.pathname + $page.url.search
          }).toString()}`
    }
  >
    <div class="media">
      {#if item.mainImage}
        <img
          class="media-img"
          src={item.mainImage}
          alt={item.marketingTitle || item.modelId}
          loading="lazy"
          decoding="async"
        />
      {:else}
        <div class="media-fallback" aria-hidden="true">
          <span class="media-fallback-text">
            {initialsFromTitle(item.marketingTitle, item.modelId)}
          </span>
        </div>
      {/if}
    </div>

    <div class="meta">
      <div class="price price--accent">
        {getPriceLabel(item.SitePriceUAH)}
      </div>

      {#if item.marketingTitle}
        <div class="mkt">{item.marketingTitle}</div>
      {/if}

      {#if getLensTypeLabel(item.TypeLens)}
        <div class="lens">{getLensTypeLabel(item.TypeLens)}</div>
      {/if}

      <div class:id-primary={!item.marketingTitle} class="id">

        {getPublicModelId(item.modelId)}
        {#if getLensTypeVendorTag(item.TypeLens)}
          {" "}{getLensTypeVendorTag(item.TypeLens)}
        {/if}
      </div>
    </div>
  </a>
{/each}

    </div>
  {/if}
</section>

<style>
  .gallery {
  padding: 16px 16px 120px;
}


  .notice {
    margin: 10px 0 12px;
    padding: 12px 14px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 16px;
    font-weight: 800;
    background: rgba(0, 0, 0, 0.04);
  }

  .gallery-toolbar {
    position: sticky;
    top: 0;
    z-index: 5;
    padding: 12px 0 12px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(8px);
    display: grid;
    gap: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .filters {
  display: flex;
  gap: 10px;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* сховати скролбар у фільтрі ширини */
.filters {
  scrollbar-width: none;          /* Firefox */
}

.filters::-webkit-scrollbar {
  display: none;                  /* Chrome / Android */
}

  
.filter-label {
  margin-bottom: 0;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 800;
  color: #000;
  white-space: nowrap;
  min-width: 0;   /* КЛЮЧОВО */
}



  .filter-item {
  font-weight: 900;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 999px;
  padding: 14px 18px;
  cursor: pointer;
  user-select: none;
  background: rgba(0, 0, 0, 0.04);
  color: #000;
  font-size: 18px;
}

/* компактні кнопки ТІЛЬКИ для фільтра ширини */
.filters .filter-item {
  padding: 8px 12px;
  font-size: 15px;
  white-space: nowrap;   /* ключове — без переносів */
}




  .filter-item.selected {
  background: #000;
  color: #fff;
  border-color: #000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
}


  .toolbar-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .results-count {
    font-size: 14px;
    color: #555;
    font-weight: 700;
  }

 

  .gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  padding-top: 12px;
}

.gallery-grid.single {
  grid-template-columns: 1fr;
}





  .product-card {
  display: grid;
  gap: 10px;
  text-decoration: none;
  color: inherit;

  border: 2px solid rgba(0, 0, 0, 0.22); /* чіткіше */
  border-radius: 18px;

  padding: 12px;
  background: #fff;

  content-visibility: auto;
  contain-intrinsic-size: 280px;
}




  .media {
    border-radius: 16px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.05);
    aspect-ratio: 4 / 3;
    display: grid;
    place-items: center;
  }

  .media-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .media-fallback {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }

  .media-fallback-text {
    font-weight: 900;
    font-size: 18px;
    color: #555;
    letter-spacing: 0.08em;
  }

  .meta {
  display: grid;
  gap: 12px;
}


  .id {
  font-weight: 400;
  font-size: 18px;
  line-height: 1.2;
  color: #555;
  margin-top: 6px;
}



  .price {
  margin-top: 10px;
  display: inline-block;

  font-size: 26px;
  line-height: 1.1;
  font-weight: 900;

  color: #000;
  background: rgba(0, 0, 0, 0.06);
  padding: 8px 12px;
  border-radius: 12px;
}

.mkt {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
  color: #000;

  letter-spacing: 0.3px;
}


.lens {
  font-size: 22px;
  font-weight: 700;
  color: #000;
  margin-top: 4px;
}

.id.id-primary {
  font-size: 20px;
  font-weight: 700;
  color: #000;
}




  .empty {
    padding: 18px 0;
    display: grid;
    gap: 10px;
  }

  .empty-title {
    font-weight: 900;
  }

  .empty-text {
    color: #555;
    font-weight: 700;
  }

  .empty-btn {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 999px;
    padding: 12px 16px;
    font-weight: 900;
    cursor: pointer;
    width: fit-content;
    background: transparent;
  }

  .filter-header {
  display: grid;
  grid-template-columns: 1fr auto !important;

  align-items: center;
  column-gap: 12px;
}


.filter-item--header {
  display: inline-flex;
  align-items: center;
  width: auto;
  margin-left: auto;
  white-space: nowrap;
}


  @media (min-width: 640px) {
    .gallery {
      padding: 16px 24px 28px;
      max-width: 1100px;
      margin: 0 auto;
    }

    .gallery-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .product-card {
      padding: 14px;
      border-radius: 22px;
    }

    .media {
      border-radius: 18px;
    }

    .gallery-grid.single {
  grid-template-columns: 1fr;
}


  }
</style>
