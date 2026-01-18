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

  type GalleryItem = FrameWidthItem & {
    modelId: string;
    marketingTitle: string;

    // IMPORTANT: use same image field as model page
    mainImage?: string;

    SitePriceUAH?: string | number | null;

    // Phase 3 (ready-only)
    DiopterValues?: string | null;
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
  {#if notice === 'model_not_found'}
    <div class="notice">
      Модель не знайдена. Показуємо актуальний каталог.
    </div>
  {/if}

  <div class="gallery-toolbar">
    <div class="filters" aria-label="Фільтр ширини оправи">
      {#each FRAME_WIDTH_RANGES as r (r.key)}
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
      {/each}
    </div>

    <div class="toolbar-row">
      <div class="results-count">
        Показано: <strong>{visibleItems.length}</strong>
      </div>

      <div
        role="button"
        tabindex="0"
        class="show-all"
        on:click={showAll}
        on:keydown={(e) => onKeyActivate(e, showAll)}
      >
        Показати всі
      </div>
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
    <div class="gallery-grid" aria-label="Галерея моделей">
      {#each visibleItems as item (item.modelId)}
        <a
          class="product-card"
          href={`/model/${encodeURIComponent(item.modelId)}?from=${encodeURIComponent(
            $page.url.pathname + $page.url.search
          )}`}
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
            <div class="title">{item.marketingTitle || item.modelId}</div>
            <div class="price">{getPriceLabel(item.SitePriceUAH)}</div>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</section>

<style>
  .gallery {
    padding: 12px 12px 24px;
  }

  .notice {
    margin: 8px 0 12px;
    padding: 10px 12px;
    border: 1px solid currentColor;
    border-radius: 12px;
    font-weight: 800;
  }

  .gallery-toolbar {
    position: sticky;
    top: 0;
    z-index: 5;
    padding: 10px 0 12px;
    backdrop-filter: blur(8px);
    display: grid;
    gap: 10px;
  }

  .filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-item {
    font-weight: 700;
    border: 1px solid rgba(0, 0, 0, 0.55);
    border-radius: 999px;
    padding: 6px 12px;
    cursor: pointer;
    user-select: none;
    background: #fff;
    color: #000;
    font-size: 14px;
  }

  .filter-item.selected {
    background: #000;
    color: #fff;
    border-color: #000;
  }

  .toolbar-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .results-count {
    font-size: 14px;
    opacity: 0.85;
  }

  .show-all {
    font-weight: 800;
    cursor: pointer;
    user-select: none;
    font-size: 14px;
  }

  /* Mobile-first товарний грід */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    padding-top: 12px;
  }

  .product-card {
    display: grid;
    gap: 10px;
    text-decoration: none;
    color: inherit;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 14px;
    padding: 10px;
    background: #fff;

    /* PERF: avoid laying out/rendering offscreen cards on mobile */
    content-visibility: auto;
    contain-intrinsic-size: 260px;
  }

  .media {
    border-radius: 12px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.04);
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
    font-weight: 800;
    font-size: 18px;
    opacity: 0.55;
    letter-spacing: 0.08em;
  }

  .meta {
    display: grid;
    gap: 4px;
  }

  .title {
    font-weight: 700;
    font-size: 14px;
    line-height: 1.2;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: calc(14px * 1.2 * 2);
  }

  .price {
    font-size: 14px;
    opacity: 0.85;
    font-weight: 700;
  }

  .empty {
    padding: 18px 0;
    display: grid;
    gap: 10px;
  }

  .empty-title {
    font-weight: 800;
  }

  .empty-text {
    opacity: 0.8;
  }

  .empty-btn {
    border: 1px solid #000;
    border-radius: 999px;
    padding: 8px 14px;
    font-weight: 800;
    cursor: pointer;
    width: fit-content;
  }

  @media (min-width: 640px) {
    .gallery {
      padding: 16px 16px 28px;
      max-width: 1100px;
      margin: 0 auto;
    }

    .gallery-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .product-card {
      padding: 12px;
    }
  }
</style>
