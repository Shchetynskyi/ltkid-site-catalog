<!-- src/routes/model/[modelId]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  // helper: wrap image url through server proxy
  function proxied(url: string) {
    return `/api/img?url=${encodeURIComponent(url)}`;
  }
</script>

{#if data.item}
  <section>
    <h1>{data.item.marketingTitle || data.item.modelId}</h1>

    <p>{data.item.modelId}</p>

    {#if data.item.mainImage}
      <img
        src={proxied(data.item.mainImage)}
        alt={data.item.marketingTitle || data.item.modelId}
        style="width: 100%; max-width: 600px; height: auto;"
      />
    {/if}

    <p>
      Ціна: {data.item.price} грн
    </p>

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
{:else}
  <p>Модель не знайдена</p>
{/if}
