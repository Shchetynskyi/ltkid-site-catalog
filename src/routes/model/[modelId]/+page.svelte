<!-- src/routes/model/[modelId]/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onDestroy, tick } from 'svelte';
  import { managerLeadPayload } from '$lib/lead/managerContext.store';
  import { MANAGER_MESSENGER_URL } from '$lib/config/links';



  


  type ModelItem = {
    modelId: string;
    marketingTitle?: string;
    mainImage?: string;

    SitePriceUAH?: string | number | null;

      gender?: string;


    frameWidth?: number | null;
    frameHeight?: number | null;

    tryOn?: boolean;
    aiPreview?: boolean;
  };

  export let data: { item: ModelItem };
  const item = data.item;
    // UI only: diopter context from URL query (?diopter=+3)
  $: diopterUi = $page.url.searchParams.get('diopter')?.trim() || '';


  function normalizeBase(raw: string): string {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return 'https://m.me/101402489688578';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

function buildManagerUrl(ref: string): string {
  const base = normalizeBase(MANAGER_MESSENGER_URL);
  const url = new URL(base);
  url.searchParams.set('ref', ref);
  return url.toString();
}

function buildMessengerPrefillUrl(ref: string): string {
  const base = normalizeBase(MANAGER_MESSENGER_URL);
  const url = new URL(base);

  // відкриваємо чат на Page
  // + додаємо prefill текстом повідомлення (юзер натисне Send)
  url.searchParams.set('ref', 'mc6'); // тригер ManyChat може залишитись
  url.searchParams.set('text', ref);  // payload як текст повідомлення

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
  const fromRaw = $page.url.searchParams.get('from');
  if (fromRaw) {
    try {
      const decoded = decodeURIComponent(fromRaw);
      const u = new URL(decoded, 'https://local.base'); // підтримка relative path
      u.searchParams.delete('diopter');                 // ключовий FIX

      const qs = u.searchParams.toString();
      const cleaned = `${u.pathname}${qs ? `?${qs}` : ''}${u.hash || ''}`;

      goto(cleaned);
      return;
    } catch {
      try {
        goto(decodeURIComponent(fromRaw));
        return;
      } catch {}
    }
  }
  goto('/gallery/frames/unisex');
}


 function buildMc6Ref(): string {
  const diopter = $page.url.searchParams.get('diopter')?.trim() || '';

  const lines = [
    '⬇️ Натисніть «Надіслати», щоб менеджер отримав ваше замовлення',
    '',
    'MC-6',
    `ModelID: ${item.modelId}`,
    `Title: ${(item.marketingTitle || item.modelId).trim()}`,
    `Price: ${getPriceLabel(item.SitePriceUAH)}`,
    item.mainImage ? `Image: ${item.mainImage}` : ''
  ].filter(Boolean);

  if (diopter) lines.push(`Diopter: ${diopter}`);

  return lines.join('\n');
}





  onDestroy(() => {
    managerLeadPayload.set(null);
  });

  const title =
  item.marketingTitle && item.marketingTitle.trim()
    ? item.marketingTitle
    : 'Окуляри';


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
  {#if diopterUi}
  <div class="diopter-badge">
    Підібрано для діоптрії: {diopterUi}
  </div>
{:else}
  <a
    class="pick-vision-link"
    href={`/gallery/ready/${encodeURIComponent(item.gender || 'унісекс')}/diopter?return=${encodeURIComponent(`/model/${item.modelId}`)}&returnModelId=${encodeURIComponent(item.modelId)}`}



    aria-label="Підібрати цю модель під мій зір"
  >
    Підібрати під мій зір
  </a>
{/if}



  <!-- NEW: Messenger CTA -->
  <button
  type="button"
  class="manager-link"
  on:click={() => {
    const diopter = $page.url.searchParams.get('diopter')?.trim() || '';
    const ref = buildMc6Ref();

    managerLeadPayload.set({
      ModelID: item.modelId,
      MarketingTitle: item.marketingTitle || item.modelId,
      SitePriceUAH: getPriceLabel(item.SitePriceUAH),
      Image: item.mainImage || '',
      ref,
      ...(diopter ? { DiopterContext: diopter } : {})
    });

    window.location.href = buildMessengerPrefillUrl(ref);



  }}
>
  Звʼязатися з менеджером
</button>



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
    /* Більше повітря між великими зонами */
    gap: 26px;

    max-width: 1100px;
    margin: 0 auto;
    padding: 16px;
    padding-bottom: calc(16px + 96px);

    /* Читабельність 40–70+ */
    color: #111;
    line-height: 1.4;
  }

  .hero {
    display: grid;
    /* Компактніше всередині hero (фото+ціна як один блок) */
    gap: 7px; /* було 10 */
  }

  .hero-media {
    width: 100%;
    padding: 0;
    border-radius: 14px;
    overflow: hidden;

    /* Cards: чітка рамка, без “декор” тіней */
    border: 1px solid rgba(0, 0, 0, 0.18);
    background: #fff;

    position: relative;
    cursor: zoom-in;
    text-align: left;
  }

  .hero-image {
    width: 100%;
    display: block;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 14px;

    /* Трохи підсилити фото (без зміни розміру) */
    filter: contrast(1.06) saturate(1.03);
  }

  .zoom-hint {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 12px;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-weight: 800;
    font-size: 14px; /* +1px */
    padding: 10px 14px;
    border-radius: 12px;
    text-align: center;
  }

  .hero-card {
    padding: 14px;
    border-radius: 14px;

    /* Card = білий фон + рамка */
    border: 1px solid rgba(0, 0, 0, 0.18);
    background: #fff;

    /* Заборонено тіні замість рамок */
    box-shadow: none;

    display: grid;
    gap: 10px;
  }

  .price {
    font-size: 34px; /* +2px */
    line-height: 1.08;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: #111;
  }

  .diopter-badge {
    display: inline-block;
    margin-top: 8px;
    padding: 10px 16px;
    border-radius: 999px;

    font-size: clamp(16px, 5.5vw, 20px);
    line-height: 1.28;
    font-weight: 900;

    border: 1px solid rgba(0, 0, 0, 0.18);
    background: #f3f3f3;
    color: #111;
    text-align: center;
  }

  .title {
    margin: 0;
    font-size: 22px; /* +2px */
    line-height: 1.22;
    font-weight: 900;
    letter-spacing: -0.01em;
    color: #111;
  }

  .card {
    padding: 16px;
    border-radius: 14px;

    /* Card = білий фон + рамка */
    border: 1px solid rgba(0, 0, 0, 0.18);
    background: #fff;

    display: grid;

    /* Усередині блоків компактніше */
    gap: 12px; /* було 16 */
  }

  .section-title {
    margin: 0;

    /* Текст не світло-сірий */
    color: #111;

    font-size: 16px; /* +2px */
    line-height: 1.25;
    font-weight: 900;
    letter-spacing: 0.03em;

    /* прибираємо “вицвітання” контенту */
    opacity: 1;
  }

  .specs {
    display: grid;
    gap: 8px; /* було 10 */
  }

  .spec {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.10);
  }

  .spec:first-child {
    border-top: 0;
    padding-top: 0;
  }

  .spec:last-child {
    padding-bottom: 0;
  }

  .spec-label {
    font-size: 16px; /* +1px */
    line-height: 1.35;
    color: #111;
    opacity: 1;
  }

  .spec-value {
    font-size: 16px; /* +1px */
    line-height: 1.35;
    text-align: right;
    color: #111;
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
    color: #111;
  }

  /* STICKY CTA */
  .cta {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16px;

    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(8px);
    border-top: 1px solid rgba(0, 0, 0, 0.18);
  }

  /* Secondary: "Дивитись ще" — така ж ширина, значно світліша, не конкурує */
  .back {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.28);
    background: #f4f4f4;
    color: #111;
    border-radius: 14px;
    padding: 16px 18px;
    font-size: 18px;
    font-weight: 900;
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
    border-radius: 14px;
    border: 0;
    background: rgba(255, 255, 255, 0.92);
    font-weight: 900;
    cursor: pointer;
    z-index: 2;
  }

  .lightbox-viewport {
    position: absolute;
    inset: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    display: grid;
    place-items: center;
    padding: 12px;
  }

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

  @media (hover: hover) {
    .manager-link:hover,
    .pick-vision-link:hover,
    .back:hover {
      transform: scale(1.01);
    }
  }

  @media (min-width: 560px) {
    .model {
      padding: 14px 16px 96px;
      gap: 22px;
    }

    .price {
      font-size: 34px;
    }

    .title {
      font-size: 22px;
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

  /* Primary: "Звʼязатись з менеджером" — чорна/макс контрастна */
  .manager-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    padding: 14px 18px;
    border-radius: 14px;
    background: #000;
    border: 1px solid #000;
    color: #fff;
    font-size: 18px;
    font-weight: 900;
    text-align: center;
    text-decoration: none;
  }

  .manager-link:active {
    transform: scale(0.98);
    opacity: 0.9;
  }

  .pick-vision-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    padding: 14px 18px;
    border-radius: 14px;
    border: 1px solid rgba(0, 0, 0, 0.18);

    /* Secondary-вигляд */
    background: #f4f4f4;
    color: #111;

    font-weight: 900;
    text-align: center;
    text-decoration: none;
  }

  .pick-vision-link:active {
    transform: scale(0.97);
    opacity: 0.9;
  }
</style>

