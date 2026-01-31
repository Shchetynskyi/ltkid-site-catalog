<script lang="ts">
  import { page } from '$app/stores';

  // Канонічний список плюсових діоптрій (SSOT: DiopterValues)
  const PLUS_DIOPTERS = [
    '+0.50', '+0.75', '+1.00', '+1.25', '+1.50', '+1.75',
    '+2.00', '+2.25', '+2.50', '+2.75', '+3.00', '+3.25',
    '+3.50', '+3.75', '+4.00', '+4.50', '+5.00', '+5.50', '+6.00'
  ];

  const gender = $page.params.gender;

  function selectDiopter(value: string) {
    const returnUrl = $page.url.searchParams.get('return');
    const returnModelId = $page.url.searchParams.get('returnModelId');

    const base = `/gallery/ready/${gender}?diopter=${encodeURIComponent(value)}`;

    const params = new URLSearchParams();
    if (returnUrl) params.set('return', returnUrl);
    if (returnModelId) params.set('returnModelId', returnModelId);

    window.location.href = params.toString()
      ? `${base}&${params.toString()}`
      : base;
  }
</script>

<section class="diopter-values">
  {#each PLUS_DIOPTERS as d}
    <button class="value-btn" on:click={() => selectDiopter(d)}>
      {d}
    </button>
  {/each}
</section>

<style>
  @import '$lib/ui/tokens.css';

  .diopter-values {
    min-height: calc(100vh - var(--header-height, 0px));
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--ui-space-s);
    padding: var(--ui-page-pad-mobile);
  }

  .value-btn {
    padding: var(--ui-pad-18) var(--ui-pad-12);
    border-radius: var(--ui-radius-m);
    border: 1px solid var(--ui-border-12);
    background: var(--ui-surface-05);

    /* КЛЮЧОВА ЗМІНА ДЛЯ ЛЮДЕЙ ЗІ СЛАБКИМ ЗОРОМ */
    font-size: 22px;
    font-weight: var(--ui-weight-800);

    cursor: pointer;
  }
</style>
