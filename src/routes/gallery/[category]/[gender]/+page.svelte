<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import {
    FRAME_WIDTH_RANGES,
    type FrameWidthRangeKey,
    filterByFrameWidth
  } from '$lib/catalog/catalog.selectors';
  import { onMount } from 'svelte';

  export let data: {
    items: Array<{
      modelId: string;
      marketingTitle: string;
      previewImage?: string;
      price?: number | null;
      frameWidth?: number | null;
    }>;
  };

  const formatPrice = (value: number | null | undefined) => {
    if (value == null || Number.isNaN(value)) return '';
    return `${Math.round(value)} грн`;
  };

  const keyForScroll = () => `scroll:${$page.url.pathname}${$page.url.search}`;

  const readRangeFromUrl = (): FrameWidthRangeKey => {
    const v = $page.url.searchParams.get('w');
    if (!v) return 'ALL';
    const ok = FRAME_WIDTH_RANGES.some((r) => r.key === v);
    return ok ? (v as FrameWidthRangeKey) : 'ALL';
  };

  let activeRange: FrameWidthRangeKey = readRangeFromUrl();

  $: {
    const next = readRangeFromUrl();
    if (next !== activeRange) activeRange = next;
  }

  $: visibleItems = filterByFrameWidth(data.items as any, activeRange);

  function setRange(key: FrameWidthRangeKey) {
    const url = new URL($page.url);
    if (key === 'ALL') url.searchParams.delete('w');
    else url.searchParams.set('w', key);

    goto(url.pathname + url.search, { replaceState: true, noScroll: true });
  }

  function showAll() {
    setRange('ALL');
  }

  function rememberScroll() {
    sessionStorage.setItem(keyForScroll(), String(window.scrollY));
  }

  onMount(() => {
    const saved = sessionStorage.getItem(keyForScroll());
    if (saved) {
      requestAnimationFrame(() => {
        window.scrollTo(0, Number(saved));
      });
    }
  });
</script>

<section class="gallery">
  <div class="gallery-toolbar" role="region" aria-label="Панель галереї">
    <div class="filters" aria-label="Фільтр ширини оправи">
      {#each FRAME_WIDTH_RANGES as r}
        <button
          type="button"
          class:active={activeRange === r.key}
          on:click={() => setRange(r.key)}
          aria-pressed={activeRange === r.key}
        >
          {r.label}
        </button>
      {/each}
    </div>

    <div class="results-count" aria-live="polite">
      Показано: <strong>{visibleItems.length}</strong>
    </div>

    <button
      type="button"
      class="show-all"
      on:click={showAll}
      aria-label="Показати всі моделі"
    >
      Показати всі
    </button>
  </div>

  {#if visibleItems.length === 0}
    <div class="empty" role="status" aria-live="polite">
      <div class="empty-title">Нічого не знайдено</div>
      <div class="empty-text">Спробуйте інший діапазон ширини або покажіть усі моделі.</div>
      <button type="button" class="empty-btn" on:click={showAll}>
        Показати всі
      </button>
    </div>
  {:else}
    <div class="gallery-list">
      {#each visibleItems as item (item.modelId)}
        <a
          class="gallery-card"
          href={`/model/${encodeURIComponent(item.modelId)}?from=${encodeURIComponent($page.url.pathname + $page.url.search)}`}
          on:click={rememberScroll}
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
  .filters button {
    font-weight: 700;
    background: none;
    border: 1px solid currentColor;
    border-radius: 999px;
    padding: 4px 10px;
    cursor: pointer;
  }
  .filters button.active {
    background: currentColor;
    color: white;
  }
  .results-count {
    font-size: 14px;
    opacity: 0.85;
  }
  .show-all {
    font-weight: 800;
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    align-self: start;
  }

  .empty {
    padding: 18px 0;
    display: grid;
    gap: 10px;
  }
  .empty-title {
    font-weight: 800;
    font-size: 18px;
  }
  .empty-text {
    opacity: 0.85;
  }
  .empty-btn {
    justify-self: start;
    font-weight: 800;
    background: none;
    border: 1px solid currentColor;
    border-radius: 999px;
    padding: 8px 14px;
    cursor: pointer;
  }

  .gallery-list {
    display: grid;
    gap: 12px;
    padding-top: 6px;
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
