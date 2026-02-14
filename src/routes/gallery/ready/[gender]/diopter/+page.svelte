<script lang="ts">
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { MANAGER_MESSENGER_URL } from '$lib/config/links';

  function buildUrl(basePath: string) {
    const p = get(page);

    const returnUrl = p.url.searchParams.get('return')?.trim() || '';
    const returnModelId = p.url.searchParams.get('returnModelId')?.trim() || '';

    const params = new URLSearchParams();
    if (returnUrl) params.set('return', returnUrl);
    if (returnModelId) params.set('returnModelId', returnModelId);

    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function normalizeBase(raw: string): string {
    const trimmed = (raw ?? '').trim();
    if (!trimmed) return 'https://m.me/101402489688578';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed.replace(/^\/+/, '')}`;
  }

  function buildMessengerPrefillUrl(text: string): string {
    const base = normalizeBase(MANAGER_MESSENGER_URL);
    const url = new URL(base);

    // ManyChat trigger
    url.searchParams.set('ref', 'mc6_v2');

    // Prefilled message (user sees it before sending)
    url.searchParams.set('text', text);

    return url.toString();
  }

  function goPlus() {
    const gender = get(page).params.gender as string;
    window.location.href = buildUrl(`/gallery/ready/${gender}/diopter/plus`);
  }

  function goMinus() {
    const gender = get(page).params.gender as string;
    window.location.href = buildUrl(`/gallery/ready/${gender}/diopter/minus`);
  }

  function goMessenger() {
    const p = get(page);
    const gender = p.params.gender as string;

    // IMPORTANT: avoid the word "діоптрії" for clients
    const text =
  `Потрібна допомога з вибором окулярів.\n` +
  `Не впевнений(а), які лінзи мені потрібні — «плюс» чи «мінус».\n\n` +
  `Натисніть «НАДІСЛАТИ», щоб менеджер отримав повідомлення.`;


    window.location.href = buildMessengerPrefillUrl(text);
  }
</script>

<section class="diopter">
  <header class="intro">
    <h1>Оберіть тип окулярів</h1>
    <p>Це допоможе показати відповідні варіанти готових окулярів</p>
  </header>

  <div class="grid">
    <button class="tile tile--plus" on:click={goPlus} aria-label="Плюсові окуляри">
      <span class="tile__text">+ Плюсові</span>
    </button>

    <button class="tile tile--minus" on:click={goMinus} aria-label="Мінусові окуляри">
      <span class="tile__text">− Мінусові</span>
    </button>

    <button class="tile tile--manager" on:click={goMessenger} aria-label="Уточнити з менеджером">
      <span class="tile__text tile__text--manager">Уточнити з менеджером</span>
    </button>
  </div>
</section>

<style>
  @import '$lib/ui/tokens.css';

  :root {
    --gap: 12px;
    --manager-h: 84px; /* було 64px */
  }

  .diopter {
    height: calc(100svh - var(--header-height, 0px));
    padding: var(--ui-page-pad-mobile);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .intro h1 {
    margin: 0 0 6px 0;
    font-size: 28px;
    font-weight: 800;
    line-height: 1.1;
  }

  .intro p {
    margin: 0;
    font-size: 17px;
    line-height: 1.3;
    color: var(--ui-gray-text);
  }

  .grid {
    flex: 1 1 auto;
    min-height: 0;

    margin-top: 12px;
    display: grid;
    gap: var(--gap);

    grid-template-rows:
      calc((100% - (2 * var(--gap)) - var(--manager-h)) / 2)
      calc((100% - (2 * var(--gap)) - var(--manager-h)) / 2)
      var(--manager-h);
  }

  .tile {
    width: 100%;
    border-radius: 18px;
    border: 1px solid var(--ui-border-12);
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 10px 14px;
  }

  .tile--plus {
    background: #f0f0f0;
  }

  .tile--minus {
    background: #e7e7e7;
  }

  .tile--manager {
    background: #dcdcdc;
  }

  .tile__text {
    font-size: 32px;
    font-weight: 900;
    letter-spacing: 0.2px;
    line-height: 1.05;
    color: #111;
    text-align: center;
  }

  .tile__text--manager {
    font-size: 24px; /* трохи більше */
    font-weight: 850;
  }
</style>
