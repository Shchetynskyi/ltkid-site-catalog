<script lang="ts">
  import { page } from '$app/stores';

  const gender = $page.params.gender;

  $: returnUrl = $page.url.searchParams.get('return')?.trim() || '';
  const withReturn = (path: string) =>
    returnUrl ? `${path}?return=${encodeURIComponent(returnUrl)}` : path;

  function goPlus() {
    const returnModelId = $page.url.searchParams.get('returnModelId');
    const base = `/gallery/ready/${gender}/diopter/plus`;
    window.location.href = returnModelId
      ? `${withReturn(base)}&returnModelId=${encodeURIComponent(returnModelId)}`
      : withReturn(base);
  }

  function goMinus() {
    const returnModelId = $page.url.searchParams.get('returnModelId');
    const base = `/gallery/ready/${gender}/diopter/minus`;
    window.location.href = returnModelId
      ? `${withReturn(base)}&returnModelId=${encodeURIComponent(returnModelId)}`
      : withReturn(base);
  }

  function goMessenger() {
    window.location.href = import.meta.env.VITE_MESSENGER_URL;
  }
</script>

<section class="diopter">
  <div class="diopter__intro">
    <h1 class="diopter__title">Оберіть тип окулярів</h1>
    <p class="diopter__text">
      Це допоможе показати відповідні варіанти готових окулярів
    </p>
  </div>

  <div class="diopter__actions">
    <button class="btn plus" on:click={goPlus}>
      ➕ Плюсові
    </button>

    <button class="btn minus" on:click={goMinus}>
      ➖ Мінусові
    </button>

    <button class="btn unsure" on:click={goMessenger}>
      Уточнити з менеджером
    </button>
  </div>
</section>

<style>
  @import '$lib/ui/tokens.css';

  .diopter {
    min-height: calc(100vh - var(--header-height, 0px));
    display: flex;
    flex-direction: column;
    padding: var(--ui-page-pad-mobile);
  }

  .diopter__intro {
    margin-bottom: 24px;
  }

  .diopter__title {
    font-size: var(--ui-text-title);
    font-weight: var(--ui-weight-600);
    margin-bottom: 6px;
  }

  .diopter__text {
    font-size: var(--ui-text-body);
    color: var(--ui-gray-text);
  }

  .diopter__actions {
    flex: 1;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    gap: var(--ui-space-m);
  }

  .btn {
    border-radius: var(--ui-radius-l);
    border: 1px solid var(--ui-border-12);
    background: var(--ui-surface-05);
    font-size: var(--ui-text-cta);
    font-weight: var(--ui-weight-600);
    cursor: pointer;
  }

  .plus {
    background: #e6f4ff;
  }

  .minus {
    background: #ffecec;
  }

  .unsure {
    background: #f2f2f2;
  }
</style>
