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
    url.searchParams.set('ref', 'mc6_v2');
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
  </header>

  <div class="grid">
    <button class="card card--plus" on:click={goPlus} aria-label="Плюсові окуляри">
      <div class="card__content">
        <div class="card__title">Плюсові</div>
        <div class="card__subtitle">окуляри</div>
      </div>
    </button>

    <button class="card card--minus" on:click={goMinus} aria-label="Мінусові окуляри">
      <div class="card__content">
        <div class="card__title">Мінусові</div>
        <div class="card__subtitle">окуляри</div>
      </div>
    </button>

    <button class="manager" on:click={goMessenger} aria-label="Уточнити з менеджером">
      Уточнити з менеджером
    </button>
  </div>
</section>

<style>
  @import '$lib/ui/tokens.css';

  .diopter {
    max-width: 720px;
    margin: 0 auto;
    padding: 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));

    /* без скролу: весь екран */
    height: calc(100svh - var(--header-height, 0px));
    display: flex;
    flex-direction: column;
  }

  .intro h1 {
    margin: 0;
    font-size: 30px;
    font-weight: 900;
    line-height: 1.1;
  }

  .grid {
  flex: 1 1 0;      /* ← важливо */
  min-height: 0;
  margin-top: 14px;

  display: grid;
  gap: 16px;

  grid-template-rows: 1fr 1fr auto;
}

  .card {
    position: relative;
    width: 100%;
    border: 0;
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
    padding: 0;

    background-size: cover;
    background-position: center 20%;
    background-repeat: no-repeat;

    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .card--plus {
    background-image: url('/diopter/plus.png?v=1');
  }

  .card--minus {
    background-image: url('/diopter/minus.png?v=1');
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.22) 0%,
      rgba(0, 0, 0, 0.30) 100%
    );
    pointer-events: none;
  }

  .card__content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 12%;
    z-index: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    padding: 0 14px;
    text-align: center;
    color: #fff;
  }

  .card__title {
    font-size: 38px;
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.02em;
  }

  .card__subtitle {
    font-size: 34px;
    font-weight: 700;
    line-height: 1.1;
    opacity: 0.92;
  }

  .card:active {
    border-color: rgba(255, 255, 255, 0.35);
  }

  .manager {
  width: 100%;
  height: 64px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #111;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 14px;
}
  @media (min-width: 640px) {
    .diopter {
      max-width: 1100px;
      padding: 32px 16px;
    }

    .grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 320px 68px;
      align-items: stretch;
    }

    .card {
      height: 320px;
      border-radius: 22px;
    }

    .manager {
      grid-column: 1 / -1;
      height: 68px;
      font-size: 22px;
    }

    .card__title {
      font-size: 46px;
    }

    .card__subtitle {
      font-size: 40px;
    }
  }
</style>