<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  export let data: {
    items: Array<{
      modelId: string;
      marketingTitle: string;
      previewImage?: string;
      price?: number | null;
    }>;
  };

  const formatPrice = (value: number | null | undefined) => {
    if (value == null || Number.isNaN(value)) return '';
    return `${Math.round(value)} грн`;
  };

  function showAll() {
    // повертаємось у той самий список без query-параметрів
    goto($page.url.pathname);
  }
</script>

<section class="gallery">
  <div class="gallery-toolbar" role="region" aria-label="Панель галереї">
    <button
      type="button"
      class="show-all"
      on:click={showAll}
      aria-label="Показати всі моделі"
    >
      Показати всі
    </button>
  </div>

  <div class="gallery-list">
    {#each data.items as item (item.modelId)}
      <a
        class="gallery-card"
        href={`/model/${encodeURIComponent(item.modelId)}?from=${encodeURIComponent($page.url.pathname)}`}
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
</section>

<style>
  .gallery-toolbar {
    position: sticky;
    top: 0;
    z-index: 5;
    padding: 10px 0;
    backdrop-filter: blur(8px);
  }

  .show-all {
    font-weight: 800;
    background: none;
    border: 0;
    padding: 0;
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
