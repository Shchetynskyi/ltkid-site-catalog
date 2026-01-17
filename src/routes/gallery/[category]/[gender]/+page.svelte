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
    previewImage?: string;
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

  // Extract ONLY tokens like +3.00 / -0.75 from possibly noisy strings
  function extractDiopters(raw: string | null | undefined): string[] {
    if (!raw) return [];
    const matches = raw.match(/[+-]\d+(?:\.\d{2})/g);
    return matches ?? [];
  }

  function diopterContains(values: string | null | undefined, d: string): boolean {
    return extractDiopters(values).includes(d);
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
      ? widthFiltered.filter((item) => diopterContains(item.DiopterValues ?? null, diopter))
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
    <div class="filters">
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
    <div class="gallery-list">
      {#each visibleItems as item (item.modelId)}
        <a
          class="gallery-card"
          href={`/model/${encodeURIComponent(item.modelId)}?from=${encodeURIComponent(
            $page.url.pathname + $page.url.search
          )}`}
        >
          {#if item.previewImage}
            <img
              class="gallery-img"
              src={item.previewImage}
              alt={item.marketingTitle || item.modelId}
              loading="lazy"
            />
          {/if}

          <div class="gallery-meta">
            <div class="gallery-title">{item.marketingTitle || item.modelId}</div>
            <div class="gallery-price">
              {getPriceLabel(item.SitePriceUAH)}
            </div>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</section>

<style>
  .notice {
    margin: 8px 0 10px;
    padding: 10px 12px;
    border: 1px solid currentColor;
    border-radius: 12px;
    font-weight: 800;
  }

  .gallery-toolbar {
    position: sticky;
    top: 0;
    z-index: 5;
    padding: 10px 0;
    backdrop-filter: blur(8px);
    display: grid;
    gap: 8px;
  }

  .gallery {
    padding-top: 12px;
  }

  .filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-item {
    font-weight: 700;
    border: 1px solid #000;
    border-radius: 999px;
    padding: 4px 10px;
    cursor: pointer;
    user-select: none;
    background: transparent;
    color: #000;
  }

  .filter-item.selected {
    background: #000;
    color: #fff;
  }

  .results-count {
    font-size: 14px;
    opacity: 0.85;
  }

  .show-all {
    font-weight: 800;
    cursor: pointer;
    user-select: none;
  }

  .gallery-list {
    display: grid;
    gap: 12px;
    padding-top: 12px;
  }

  .gallery-card {
    display: grid;
    gap: 8px;
    text-decoration: none;
    color: inherit;
  }

  .gallery-img {
    width: 100%;
    border-radius: 12px;
  }

  .gallery-title {
    font-weight: 700;
  }

  .gallery-price {
    opacity: 0.8;
  }

  .empty {
    padding: 18px 0;
    display: grid;
    gap: 10px;
  }

  .empty-btn {
    border: 1px solid #000;
    border-radius: 999px;
    padding: 8px 14px;
    font-weight: 800;
    cursor: pointer;
  }
</style>
