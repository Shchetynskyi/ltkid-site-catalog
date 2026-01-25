<script lang="ts">
  import { page } from '$app/stores';

  // Канонічний список мінусових діоптрій (SSOT: DiopterValues)
  const MINUS_DIOPTERS = [
    '-0.50', '-0.75', '-1.00', '-1.25', '-1.50', '-1.75',
    '-2.00', '-2.25', '-2.50', '-2.75', '-3.00', '-3.25',
    '-3.50', '-3.75', '-4.00', '-4.50', '-5.00', '-5.50', '-6.00'
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
  {#each MINUS_DIOPTERS as d}
    <button class="value-btn" on:click={() => selectDiopter(d)}>
      {d}
    </button>
  {/each}
</section>

<style>
  .diopter-values {
    min-height: calc(100vh - var(--header-height, 0px));
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 16px;
  }

  .value-btn {
    padding: 16px 8px;
    border-radius: 14px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: rgba(0, 0, 0, 0.05);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }
</style>
