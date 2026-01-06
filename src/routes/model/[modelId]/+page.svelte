<!-- src/routes/model/[modelId]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  let showFullscreen = false;
</script>

{#if data.item}
  <section>
    <h1>{data.item.marketingTitle || data.item.modelId}</h1>
    <p>{data.item.modelId}</p>

    {#if data.item.mainImage}
      <button
        type="button"
        on:click={() => (showFullscreen = true)}
        style="
          border: none;
          padding: 0;
          background: none;
          cursor: zoom-in;
        "
        aria-label="Збільшити фото"
      >
        <img
          src={data.item.mainImage}
          alt={data.item.marketingTitle || data.item.modelId}
          style="width: 100%; max-width: 600px; height: auto;"
        />
      </button>
      <p style="font-size: 12px; opacity: 0.7;">Натисніть, щоб збільшити</p>
    {/if}

    <p>Ціна: {data.item.price} грн</p>

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
  </section>

  {#if showFullscreen}
    <button
      type="button"
      on:click={() => (showFullscreen = false)}
      aria-label="Закрити перегляд"
      style="
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        border: none;
        padding: 0;
        cursor: zoom-out;
      "
    >
      <img
        src={data.item.mainImage}
        alt={data.item.marketingTitle || data.item.modelId}
        style="max-width: 95%; max-height: 95%;"
      />
    </button>
  {/if}
{:else}
  <p>Модель не знайдена</p>
{/if}
