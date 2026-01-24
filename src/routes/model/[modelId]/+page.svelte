<!-- src/routes/model/[modelId]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount, onDestroy, tick } from 'svelte';
  import { managerLeadPayload } from '$lib/lead/managerContext.store';
  import { MANAGER_MESSENGER_URL } from '$lib/config/links';
  import { get } from 'svelte/store';


  


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

  function normalizeBase(raw: string): string {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return 'https://m.me/101402489688578';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

function buildManagerUrl(pathname: string): string {
  const base = normalizeBase(MANAGER_MESSENGER_URL);
  const url = new URL(base);

  const payload = get(managerLeadPayload);

  if (payload) {
    url.searchParams.set('ref', payload.ref);
    url.searchParams.set('ModelID', payload.ModelID);
    url.searchParams.set('MarketingTitle', payload.MarketingTitle);
    url.searchParams.set('SitePriceUAH', payload.SitePriceUAH);
    url.searchParams.set('Image', payload.Image);

    if (payload.DiopterContext) {
      url.searchParams.set('DiopterContext', payload.DiopterContext);
    }

    return url.toString();
  }

  url.searchParams.set('ref', 'site_catalog__from_site');
  return url.toString();
}



  function getPriceLabel(value: unknown): string {
    const n =
      typeof value === 'number'
        ? value
        : typeof value === 'string'
          ? Number(value.trim().replace(',', '.'))
          : NaN;

    if (!Number.isFinite(n) || n <= 0) return 'Ціну уточнюйте';
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

  const title =
    item.marketingTitle && item.marketingTitle.trim()
      ? item.marketingTitle
      : 'Модель окулярів';

  // Lightbox (native zoom)
  let isLightboxOpen = false;
  let closeBtnEl: HTMLButtonElement | null = null;

  async function openLightbox(): Promise<void> {
    if (!item.mainImage) return;
    isLightboxOpen = true;
    await tick();
    closeBtnEl?.focus?.();
  }

  function closeLightbox(): void {
    isLightboxOpen = false;
  }

  function onWindowKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && isLightboxOpen) closeLightbox();
  }

  $: managerUrl = buildManagerUrl($page.url.pathname);


</script>

<svelte:window on:keydown={onWindowKeydown} />

<section class="model">
  <!-- HERO -->
  <header class="hero">
    {#if item.mainImage}
      <button
        type="button"
        class="hero-media"
        on:click={openLightbox}
        aria-label="Відкрити фото у збільшенні"
      >
        <img class="hero-image" src={item.mainImage} alt={title} />
        <span class="zoom-hint" aria-hidden="true">Натисніть, щоб збільшити</span>
      </button>
    {/if}

    <div class="hero-card">
  <div class="price" aria-label="Ціна">{getPriceLabel(item.SitePriceUAH)}</div>

  <!-- NEW: Messenger CTA -->
  <a
    class="manager-link"
    href={managerUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Звʼязатися з менеджером у Messenger"
  >
    Звʼязатися з менеджером
  </a>

  <h1 class="title">{title}</h1>
</div>

  </header>

  <!-- INFO -->
  <section class="card" aria-label="Характеристики">
    <h2 class="section-title">Характеристики</h2>

    <div class="specs" role="list">
      {#if item.frameWidth != null}
        <div class="spec" role="listitem">
          <div class="spec-label">Ширина оправи</div>
          <div class="spec-value"><strong>{item.frameWidth} мм</strong></div>
        </div>
      {/if}

      {#if item.frameHeight != null}
        <div class="spec" role="listitem">
          <div class="spec-label">Висота оправи</div>
          <div class="spec-value"><strong>{item.frameHeight} мм</strong></div>
        </div>
      {/if}

      {#if item.frameWidth == null && item.frameHeight == null}
        <div class="spec spec-empty" role="listitem">
          <div class="spec-label">Розміри</div>
          <div class="spec-value">Немає даних</div>
        </div>
      {/if}
    </div>
  </section>

  <!-- OPTIONAL (visual only) -->
  {#if item.tryOn || item.aiPreview}
    <section class="card" aria-label="Додатково">
      <h2 class="section-title">Додатково</h2>

      <div class="services">
        {#if item.tryOn}
          <button type="button" class="ghost">Приміряти на себе</button>
        {/if}
        {#if item.aiPreview}
          <button type="button" class="ghost">Подивитись на інших</button>
        {/if}
      </div>
    </section>
  {/if}

<!-- CTA (same text & behavior) -->
<div class="cta">
  <button type="button" class="back" on:click={viewMore}>Дивитись ще</button>
</div>



  <!-- LIGHTBOX: native zoom (no custom JS) -->
  {#if isLightboxOpen && item.mainImage}
    <div class="lightbox" role="dialog" aria-modal="true" aria-label="Збільшене фото">
      <button
        type="button"
        class="lightbox-backdrop"
        on:click={closeLightbox}
        aria-label="Закрити"
      ></button>

      <button
        type="button"
        class="lightbox-close"
        on:click={closeLightbox}
        aria-label="Закрити"
        bind:this={closeBtnEl}
      >
        ✕
      </button>

      <!-- Вʼюпорт без перехоплення жестів: pinch робить браузер -->
      <div class="lightbox-viewport" aria-label="Перегляд фото">
        <img class="lightbox-image" src={item.mainImage} alt={title} />
      </div>
    </div>
  {/if}
</section>

<style>
  .model {
    display: grid;
    gap: 12px;
    padding: 12px 12px 96px;
    max-width: 720px;
    margin: 0 auto;
  }

  .hero {
    display: grid;
    gap: 10px;
  }

  .hero-media {
    width: 100%;
    padding: 0;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: #f3f3f3;
    position: relative;
    cursor: zoom-in;
    text-align: left;
  }

  .hero-image {
    width: 100%;
    display: block;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  .zoom-hint {
    position: absolute;
    left: 10px;
    bottom: 10px;
    background: rgba(0, 0, 0, 0.75);
    color: #fff;
    font-weight: 900;
    font-size: 12px;
    padding: 8px 10px;
    border-radius: 999px;
  }

  .hero-card {
    padding: 14px;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.10);
    background: #fff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    display: grid;
    gap: 6px;
  }

  .price {
    font-size: 28px;
    line-height: 1.05;
    font-weight: 1000;
  }

  .title {
    margin: 0;
    font-size: 18px;
    line-height: 1.2;
    font-weight: 900;
  }
  
  .card {
    padding: 14px;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.10);
    background: #fff;
    display: grid;
    gap: 10px;
  }

  .section-title {
    margin: 0;
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.65;
  }

  .specs {
    display: grid;
    gap: 10px;
  }

  .spec {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }

  .spec:first-child {
    border-top: 0;
    padding-top: 0;
  }

  .spec:last-child {
    padding-bottom: 0;
  }

  .spec-label {
    font-size: 14px;
    opacity: 0.78;
  }

  .spec-value {
    font-size: 14px;
    text-align: right;
  }

  .services {
    display: grid;
    gap: 10px;
  }

  .ghost {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.22);
    background: transparent;
    border-radius: 999px;
    padding: 12px 14px;
    font-weight: 900;
    cursor: pointer;
  }

  /* STICKY CTA */
  .cta {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12px;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(8px);
    border-top: 1px solid rgba(0, 0, 0, 0.10);
  }

  .back {
    width: 100%;
    border: 1px solid #000;
    background: #000;
    color: #fff;
    border-radius: 999px;
    padding: 14px;
    font-weight: 1000;
    cursor: pointer;
  }

  /* LIGHTBOX: native zoom */
  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 50;
  }

  .lightbox-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    border: 0;
    padding: 0;
  }

  .lightbox-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 48px;
    height: 48px;
    border-radius: 999px;
    border: 0;
    background: rgba(255, 255, 255, 0.92);
    font-weight: 1000;
    cursor: pointer;
    z-index: 2;
  }

  /* Вʼюпорт: scroll/pan, без перехоплення жестів */
  .lightbox-viewport {
    position: absolute;
    inset: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    display: grid;
    place-items: center;
    padding: 12px;
  }

  /* Ключ: робимо “полотно” ширше за екран, щоб zoom мав сенс */
  .lightbox-image {
    width: min(2200px, 260vw);
    max-width: none;
    height: auto;
    touch-action: pan-x pan-y;
    display: block;
    border-radius: 14px;
    background: #fff;
  }

  @media (max-width: 420px) {
    .lightbox-image {
      width: 260vw;
      border-radius: 10px;
    }
  }

  @media (min-width: 560px) {
    .model {
      padding: 14px 16px 96px;
      gap: 14px;
    }

    .price {
      font-size: 32px;
    }

    .title {
      font-size: 20px;
    }

    .cta {
      left: 50%;
      transform: translateX(-50%);
      max-width: 720px;
    }

    .lightbox-image {
      width: min(1400px, 160vw);
    }
  }

  .manager-link {
  display: inline-block;
  margin-top: 8px;
  padding: 12px 16px;
  border-radius: 999px;
  background: #000;
  color: #fff;
  font-weight: 900;
  text-align: center;
  text-decoration: none;
}

.manager-link:active {
  transform: scale(0.96);
  opacity: 0.85;
}

</style>
