<!-- src/routes/model/[modelId]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import type { CatalogItem } from '$lib/catalog/catalog.types';

  export let data: {
    item: CatalogItem | null;
  };

  function formatPrice(value: number | null): string {
    if (value == null || Number.isNaN(value)) return '';
    return `${Math.round(value)} грн`;
  }

  function safeFrom(): string {
    const raw = $page.url.searchParams.get('from');
    if (!raw) return '/';
    try {
      const decoded = decodeURIComponent(raw);
      return decoded.startsWith('/gallery/') ? decoded : '/';
    } catch {
      return '/';
    }
  }

  function goBack(): void {
    goto(safeFrom());
  }
</script>

{#if data.item}
  <section class="model">
    <h1>{data.item.marketingTitle || data.item.modelId}</h1>
    <div>{data.item.modelId}</div>

    {#if data.item.mainImage}
      <img
        src={data.item.mainImage}
        alt={data.item.marketingTitle || data.item.modelId}
      />
    {/if}

    {#if data.item.price !== 0}
      <div>{formatPrice(data.item.price)}</div>
    {/if}

    {#if data.item.tryOn || data.item.aiPreview}
      <div>
        {#if data.item.tryOn}
          <button type="button">Приміряти на себе</button>
        {/if}
        {#if data.item.aiPreview}
          <button type="button">Подивитись на інших</button>
        {/if}
      </div>
    {/if}

    <button
      type="button"
      on:click={goBack}
      aria-label="Повернутися до списку моделей"
    >
      Дивитись ще
    </button>
  </section>
{/if}
