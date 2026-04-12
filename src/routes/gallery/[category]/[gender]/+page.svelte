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
  mainImage?: string;
  SitePriceUAH?: string | number | null;
  DiopterValues?: string | null;
  TypeLens?: string | null;

  // 🔑 додано
  gender?: string;
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

  function readLensFromUrl(): 'PHOTO' | 'TINT' | 'BB' | null {
  const v = ($page.url.searchParams.get('lens') ?? '').trim().toUpperCase();

  if (v === 'PHOTO') return 'PHOTO';
  if (v === 'TINT') return 'TINT';
  if (v === 'BB') return 'BB';

  return null;
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
  let genderFilter = readGenderFromUrl();

  let lensFilter = readLensFromUrl();

function readGenderFromUrl(): 'all' | 'female' | 'male' {
  const v = $page.url.searchParams.get('gf');
  if (v === 'female') return 'female';
  if (v === 'male') return 'male';
  return 'all';
}
  let notice: string | null = readNoticeFromUrl();

  $: {
    const nextNotice = readNoticeFromUrl();
    if (nextNotice !== notice) notice = nextNotice;
  }

 
  $: diopter = readDiopterFromUrl();

  
  $: returnUrl = $page.url.searchParams.get('return')?.trim() || null;

  $: returnModelId = $page.url.searchParams.get('returnModelId')?.trim() || null;



  // 1. фільтр по статі
$: genderFiltered =
  genderFilter === 'all'
    ? data.items
    : data.items.filter((item) => {
        const g = (item.gender || '').trim().toLowerCase();

        const isUnisex =
          g === 'унісекс' || g === 'unisex' || g === 'унисекс';

        const isFemale =
          g === 'жіноча' || g === 'женская' || g === 'female' || g === 'w';

        const isMale =
          g === 'чоловіча' || g === 'мужская' || g === 'male' || g === 'm';

        if (genderFilter === 'female') {
          return isFemale || isUnisex;
        }

        if (genderFilter === 'male') {
          return isMale || isUnisex;
        }

        return true;
      });

// 2. фільтр по ширині
$: widthFiltered = filterByFrameWidth(genderFiltered, activeRange);

// 3. фільтр по типу лінз
$: lensFiltered =
  lensFilter === null
    ? widthFiltered
    : widthFiltered.filter((item) => item.TypeLens === lensFilter);

// 3. фільтр по діоптрії
$: visibleItems =
  isReadyCategory() && diopter
    ? lensFiltered.filter((item) => diopterContains(item.modelId, diopter))
    : lensFiltered;

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

  function setGenderFilter(v: 'all' | 'female' | 'male') {
  genderFilter = v;

  const url = new URL($page.url);

  if (v === 'all') url.searchParams.delete('gf');
  else url.searchParams.set('gf', v);

  goto(url.pathname + url.search, { replaceState: true, noScroll: true });
}

function setLensFilter(v: 'PHOTO' | 'TINT' | 'BB' | null) {
  lensFilter = v;

  const url = new URL($page.url);

  if (v === null) url.searchParams.delete('lens');
  else url.searchParams.set('lens', v);

  goto(url.pathname + url.search, { replaceState: true, noScroll: true });
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
  <div class="filters" aria-label="Фільтр типу лінз">
  <button
    type="button"
    class="filter-item"
    class:selected={lensFilter === null}
    on:click={() => setLensFilter(null)}
  >
    Всі
  </button>

  <button
    type="button"
    class="filter-item"
    class:selected={lensFilter === 'PHOTO'}
    on:click={() => setLensFilter('PHOTO')}
  >
    Хамелеони
  </button>

  <button
    type="button"
    class="filter-item"
    class:selected={lensFilter === 'TINT'}
    on:click={() => setLensFilter('TINT')}
  >
    Тоновані
  </button>

  <button
    type="button"
    class="filter-item"
    class:selected={lensFilter === 'BB'}
    on:click={() => setLensFilter('BB')}
  >
    Блюблокери
  </button>
</div>
  <div class="filter-header">
  <!-- 🔑 ФІЛЬТР СТАТІ -->
<div class="filters" aria-label="Фільтр статі">
  <button
    type="button"
    class="filter-item"
    class:selected={genderFilter === 'all'}
    on:click={() => setGenderFilter('all')}
  >
    Всі
  </button>

  <button
    type="button"
    class="filter-item"
    class:selected={genderFilter === 'female'}
    on:click={() => setGenderFilter('female')}
  >
    Жіночі
  </button>

  <button
    type="button"
    class="filter-item"
    class:selected={genderFilter === 'male'}
    on:click={() => setGenderFilter('male')}
  >
    Чоловічі
  </button>
</div>
    
<select
  class="width-select"
  aria-label="Фільтр ширини оправи"
  bind:value={activeRange}
  on:change={(e) => setRange((e.currentTarget as HTMLSelectElement).value as FrameWidthRangeKey)}
>
  {#each FRAME_WIDTH_RANGES as r (r.key)}
    <option value={r.key}>{r.label}</option>
  {/each}
</select>
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
            from: encodeURIComponent($page.url.pathname + $page.url.search)
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
  :global(body) {
    background: #fbf7f1; /* тепліше тло для довіри */
  }

  .gallery {
    padding: 16px 16px 120px;
  }

  .notice {
    margin: 10px 0 12px;
    padding: 12px 14px;
    border: 1px solid rgba(0, 0, 0, 0.10);
    border-radius: 16px;
    font-weight: 800;
    background: #fff;
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  }

  /* STICKY HEADER (залишається хедером) */
  .gallery-toolbar {
    position: sticky;
    top: 0;
    z-index: 5;

    padding: 12px 16px;
    margin: 0 -16px 12px;

    background: rgba(251, 247, 241, 0.96);
    border-bottom: 1px solid rgba(0,0,0,0.10);
    backdrop-filter: blur(8px);

    display: grid;
    gap: 12px;
  }

 .filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

    .width-select {
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 999px;
  padding: 10px 14px;

  font-weight: 900;
  font-size: 16px;

  background: #fff;
  color: #111;

  box-shadow: 0 4px 12px rgba(0,0,0,0.06);

  appearance: none;
  cursor: pointer;
}

  .filters {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;

  overflow-x: auto;

  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

  .filters::-webkit-scrollbar {
    display: none;
  }

  /* Pills: теплі, “салон”, не “адмінка” */
  .filter-item {
    font-weight: 900;
    border: 1px solid rgba(0, 0, 0, 0.14);
    border-radius: 999px;
    padding: 10px 14px;
    cursor: pointer;
    user-select: none;

    background: #fff;
    color: #111;

    font-size: 16px;
    white-space: nowrap;

    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }

  .filter-item.selected {
    background: #111;
    color: #fff;
    border-color: #111;
    box-shadow: 0 8px 18px rgba(0,0,0,0.16);
  }

  
  .toolbar-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .results-count {
    font-size: 15px;
    color: #333;
    font-weight: 800;
  }

  .view-toggle {
    border: 1px solid rgba(0,0,0,0.14);
    background: #fff;
    border-radius: 999px;
    padding: 10px 14px;
    font-weight: 900;
    font-size: 15px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    padding-top: 8px;
  }

  .gallery-grid.single {
    grid-template-columns: 1fr;
  }

  .product-card {
  display: grid;
  gap: 10px;
  text-decoration: none;
  color: inherit;

  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;

  padding: 12px;
  background: #fff;

  /* ключ: світлова межа + природна тінь */
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.75),
    0 16px 34px rgba(0, 0, 0, 0.12),
    0 3px 10px rgba(0, 0, 0, 0.05);

  content-visibility: auto;
  contain-intrinsic-size: 280px;
}

  .media {
    border-radius: 16px;
    overflow: hidden;
    background: #f6efe6;
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
    color: #666;
    letter-spacing: 0.08em;
  }

  .meta {
    display: grid;
    gap: 10px;
  }

  .price {
  margin-top: 8px;

  font-size: 28px;
  line-height: 1.2;
  font-weight: 950;

  color: #000;
  letter-spacing: 0.3px;
}

  .mkt {
    font-size: 20px;
    font-weight: 800;
    line-height: 1.3;
    color: #111;
    letter-spacing: 0.2px;
  }

  .lens {
    font-size: 16px;
    font-weight: 800;
    color: #111;
    opacity: 0.9;
  }

  .id {
    font-weight: 700;
    font-size: 16px;
    line-height: 1.2;
    color: #555;
    margin-top: 2px;
  }

  .id.id-primary {
    font-size: 17px;
    font-weight: 800;
    color: #111;
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
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }

  @media (min-width: 640px) {
    :global(body) {
  background: #f3ede5;
  }

    .gallery {
      padding: 16px 24px 28px;
      max-width: 1100px;
      margin: 0 auto;
    }

    .gallery-toolbar {
      margin: 0 0 14px;
      padding: 12px 14px;
      border-radius: 18px;
      border: 1px solid rgba(0,0,0,0.10);
      box-shadow: 0 10px 26px rgba(0,0,0,0.06);
    }

    .gallery-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .gallery-grid.single {
      grid-template-columns: 1fr;
    }
  }
</style>
