<script lang="ts">
  import { page } from '$app/stores';

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

  $: from = $page.url.searchParams.get('from') || '/';
</script>

<section class="model">
  <h1 class="model-title">{data.item.marketingTitle || data.item.modelId}</h1>
  <div class="model-id">{data.item.modelId}</div>

  {#if data.item.mainImage}
    <div class="model-photo">
      <!-- тут залишайте ваш існуючий fullscreen/a11y механізм як був у baseline -->
      <img src={data.item.mainImage} alt={data.item.marketingTitle || data.item.modelId} />
    </div>
  {/if}

  {#if data.item.price != null}
    <div class="model-price">{formatPrice(data.item.price)}</div>
  {/if}

  {#if data.item.tryOn || data.item.aiPreview}
    <div class="model-actions">
      {#if data.item.tryOn}
        <button type="button">Приміряти на себе</button>
      {/if}
      {#if data.item.aiPreview}
        <button type="button">Подивитись на інших</button>
      {/if}
    </div>
  {/if}

  <div class="model-more">
    <a class="model-more-link" href={from}>Дивитись ще</a>
  </div>
</section>

<style>
  /* Мінімально, якщо у вас вже є глобальні стилі — можна прибрати цей блок */
  .model {
    display: grid;
    gap: 12px;
  }
  .model-title {
    font-size: 24px;
    font-weight: 800;
    margin: 0;
  }
  .model-id {
    opacity: 0.7;
  }
  .model-photo img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 12px;
  }
  .model-price {
    font-size: 22px;
    font-weight: 800;
  }
  .model-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .model-more {
    padding-top: 8px;
  }
  .model-more-link {
    display: inline-block;
    font-weight: 800;
    text-decoration: none;
  }
</style>
