<!-- src/routes/model/[modelId]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

{#if data.item}
  <section>
    <h1>{data.item.marketingTitle || data.item.modelId}</h1>

    <p>{data.item.modelId}</p>

    {#if data.item.mainImage}
      <img
        src={data.item.mainImage}
        alt={data.item.marketingTitle || data.item.modelId}
        style="max-width: 100%; height: auto;"
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
