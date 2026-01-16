<!-- src/routes/model/[modelId]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount, onDestroy } from 'svelte';
  import { managerLeadPayload } from '$lib/lead/managerContext.store';

  type ModelItem = {
    modelId: string;
    marketingTitle?: string;
    mainImage?: string;

    SitePriceUAH?: string | number | null;

    frameWidth?: number | null;
    frameHeight?: number | null;

    tryOn?: boolean;
    aiPreview?: boolean;
  };

  export let data: { item: ModelItem };
  const item = data.item;

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

  function viewMore(): void {
    const from = $page.url.searchParams.get('from');
    if (from) {
      try {
        goto(decodeURIComponent(from));
        return;
      } catch {}
    }
    goto('/gallery/frames/unisex');
  }

  onMount(() => {
    managerLeadPayload.set({
      ModelID: item.modelId,
      MarketingTitle: item.marketingTitle || item.modelId,
      SitePriceUAH: getPriceLabel(item.SitePriceUAH),
      Image: item.mainImage || '',
      ref: 'site_catalog__model'
      // DiopterContext intentionally absent in Phase 2
    });
  });

  onDestroy(() => {
    managerLeadPayload.set(null);
  });
</script>

<section class="model">
  {#if item.mainImage}
    <img
      class="image"
      src={item.mainImage}
      alt={item.marketingTitle || item.modelId}
    />
  {/if}

  <h1 class="title">{item.marketingTitle || item.modelId}</h1>

  <div class="price">
    {getPriceLabel(item.SitePriceUAH)}
  </div>

  {#if item.frameWidth != null}
    <div class="dims">
      Ширина оправи: <strong>{item.frameWidth} мм</strong>
    </div>
  {/if}

  {#if item.frameHeight != null}
    <div class="dims">
      Висота оправи: <strong>{item.frameHeight} мм</strong>
    </div>
  {/if}

  {#if item.tryOn || item.aiPreview}
    <div class="services">
      {#if item.tryOn}
        <button type="button">Приміряти на себе</button>
      {/if}
      {#if item.aiPreview}
        <button type="button">Подивитись на інших</button>
      {/if}
    </div>
  {/if}

  <button type="button" class="back" on:click={viewMore}>
    Дивитись ще
  </button>
</section>

<style>
  .model {
    display: grid;
    gap: 12px;
    padding-bottom: 24px;
  }

  .image {
    width: 100%;
    border-radius: 12px;
    display: block;
  }

  .title {
    font-size: 20px;
    font-weight: 800;
    margin: 0;
  }

  .price {
    font-weight: 800;
  }

  .dims {
    margin-top: 4px;
  }

  .services {
    display: grid;
    gap: 8px;
    margin-top: 8px;
  }

  .services button,
  .back {
    border: 1px solid #000;
    background: transparent;
    border-radius: 999px;
    padding: 10px 14px;
    font-weight: 800;
    cursor: pointer;
  }
</style>
