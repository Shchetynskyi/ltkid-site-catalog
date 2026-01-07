<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  export let data: {
    item: {
      modelId: string;
      marketingTitle: string;
      mainImage?: string;
      price?: number | null;
      tryOn?: boolean;
      aiPreview?: boolean;
    };
  };

  const formatPrice = (value: number | null | undefined) => {
    if (value == null || Number.isNaN(value)) return '';
    return `${Math.round(value)} грн`;
  };

  function safeFrom(): string {
    const raw = $page.url.searchParams.get('from');
    if (!raw) return '/';
    try {
      const decoded = decodeURIComponent(raw);
      // allow тільки повернення в галерею
      if (decoded.startsWith('/gallery/')) return decoded;
      return '/';
    } catch {
      return '/';
    }
  }

  function goBack() {
    goto(safeFrom());
  }
</script>

<section class="model">
  <h1>{data.item.marketingTitle || data.item.modelId}</h1>
  <div>{data.item.modelId}</div>

  {#if data.item.mainImage}
    <img src={data.item.mainImage} alt={data.item.marketingTitle || data.item.modelId} />
  {/if}

  {#if data.item.price != null}
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

  <button type="button" on:click={goBack}>
    Дивитись ще
  </button>
</section>
