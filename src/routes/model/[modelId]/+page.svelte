<!-- src/routes/gallery/[category]/[gender]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  import {
    FRAME_WIDTH_RANGES,
    type FrameWidthRangeKey,
    filterByFrameWidth,
    type FrameWidthItem
  } from '$lib/catalog/catalog.selectors';
  import { galleryScrollKey } from '$lib/utils/scroll';

  type GalleryItem = FrameWidthItem & {
    modelId: string;
    marketingTitle: string;
    previewImage?: string;
    price?: number | null;
  };

  export let data: { items: GalleryItem[] };

  function formatPrice(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) return '';
    return `${Math.round(value)} грн`;
  }

  function readRangeFromUrl(): FrameWidthRangeKey {
    const v = $page.url.searchParams.get('w');
    if (!v) return 'ALL';
    return FRAME_WIDTH_RANGES.some((r) => r.key === v) ? (v as FrameWidthRangeKey) : 'ALL';
  }

  function readNoticeFromUrl(): string | null {
    const n = $page.url.searchParams.get('notice');
    return n ? n : null;
  }

  let activeRange: FrameWidthRangeKey = readRangeFromUrl();
  let notice: string | null = readNoticeFromUrl();

  $: {
    const next = readRangeFromUrl();
    if (next !== activeRange) activeRange = next;
  }

  $: {
    const nextNotice = readNoticeFromUrl();
    if (nextNotice !== notice) notice = nextNotice;
  }

  $: visibleItems = filterByFrameWidth(data.items, activeRange);

  function setRange(key: FrameWidthRangeKey): void {
    const url = new URL($page.url);
    if (key === 'ALL') url.searchParams.delete('w');
    else url.searchParams.set('w', key);

    goto(url.pathname + url.search, { replaceState: true, noScroll: true });
  }

  function showAll(): void {
    setRange('ALL');
  }

  function onEnterOrSpace(e: KeyboardEvent, fn: () => void): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  }

  onMount(() => {
    const url = new URL($page.url);
    const n = url.searchParams.get('notice');

    if (n === 'model_not_found' && url.searchParams.has('w')) {
      url.searchParams.delete('w');
      goto(url.pathname + url.search, { replaceState: true, noScroll: true });
    }

    const key = galleryScrollKey($page);

    const saved = sessionStorage.getItem(key);
    if (saved) {
      requestAnimationFrame(() => window.scrollTo(0, Number(saved)));
    }

    const onScroll = (): void => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<section class="gallery">
  {#if notice === 'model_not_found'}
    <div class="notice" role="status" aria-live="polite">
      Модель не знайдена. Показуємо актуальний каталог.
    </div>
  {/if}

  <div class="gallery-toolbar" role="region" aria-label="Панель галереї">
    <div class="filters" aria-label="Фільтр ширини оправи">
      {#each FRAME_WIDTH_RANGES as r (r.key)}
        <div
          role="button"
          tabindex="0"
          class="filter-btn"
          class:selected={activeRange === r.key}
          aria-pressed={activeRange === r.key}
          on:click={() => setRange(r.key)}
          on:keydown={(e) => onEnterOrSpace(e, () => setRange(r.key))}
        >
          {r.label}
        </div>
      {/each}
    </div>

    <div class="results-count" aria-live="polite">
      Показано: <strong>{visibleItems.length}</strong>
    </div>

    <div
      role="button"
      tabindex="0"
      class="show-all"
      on:click={showAll}
      on:keydown={(e) => onEnterOrSpace(e, showAll)}
    >
      Показати всі
    </div>
  </div>

  {#if visibleItems.length === 0}
    <div class="empty" role="status" aria-live="polite">
      <div class="empty-title">Нічого не знайдено</div>
      <div class="empty-text">
        Спробуйте інший діапазон ширини або покажіть усі моделі.
      </div>

      <div
        role="button"
        tabindex="0"
        class="empty-btn"
        on:click={showAll}
        on:keydown={(e) => onEnterOrSpace(e, showAll)}
      >
        Показати всі
      </div>
    </div>
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
            {#if item.price != null}
              <div class="gallery-price">{formatPrice(item.price)}</div>
            {/if}
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

  .filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter-btn {
    font-weight: 700;
    background: transparent;
    border: 1px solid #000;
    border-radius: 999px;
    padding: 4px 10px;
    cursor: pointer;
    user-select: none;
    color: #000;
  }

  .filter-btn.selected {
    background: #000;
    color: #fff;
    border-color: #000;
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

  .empty {
    padding: 18px 0;
    display: grid;
    gap: 10px;
    margin-top: 10px;
  }

  .empty-title {
    font-weight: 800;
    font-size: 18px;
  }

  .empty-text {
    opacity: 0.85;
  }

  .empty-btn {
    font-weight: 800;
    border: 1px solid #000;
    border-radius: 999px;
    padding: 8px 14px;
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
    height: auto;
    display: block;
    border-radius: 12px;
  }

  .gallery-meta {
    display: grid;
    gap: 4px;
  }

  .gallery-title {
    font-weight: 700;
  }

  .gallery-price {
    opacity: 0.8;
  }
</style>
