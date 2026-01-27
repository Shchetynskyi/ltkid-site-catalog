<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  // Launch mode
  const LAUNCH_MODE = 'READY_ONLY';

  const cards =
    LAUNCH_MODE === 'READY_ONLY'
      ? data.cards.filter((c) => c.category === 'ready')
      : data.cards;

  function hrefFor(card: { category: string; gender: string }) {
    const gender = card.gender === 'жіноча' ? 'жіноча' : 'чоловіча';
    return `/gallery/ready/${gender}/select`;
  }

  function titleFor(card: { gender: string }) {
    return card.gender === 'жіноча'
      ? 'Готові окуляри для жінок'
      : 'Готові окуляри для чоловіків';
  }
</script>

<section class="home">
  <div class="home__grid home__grid--ready">
    {#each cards as card}
      <a
        href={hrefFor(card)}
        class="home__card"
      >
        <span class="home__card-title">
          {titleFor(card)}
        </span>
      </a>
    {/each}
  </div>
</section>

<style>
  .home {
    max-width: 720px;
    margin: 0 auto;
    padding: 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }

  /* READY_ONLY = 2 великі сцени */
  .home__grid--ready {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    min-height: calc(100vh - 120px);
  }

  .home__card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    min-height: 180px;
    border-radius: 18px;
    text-decoration: none;
    color: inherit;

    background: linear-gradient(
      180deg,
      #f6f7f8 0%,
      #eef1f4 100%
    );

    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  .home__card-title {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 14px;
    padding: 12px 14px;

    font-size: 18px;
    font-weight: 700;
    line-height: 1.25;
    text-align: center;
  }

  .home__card:active {
    border-color: rgba(0, 0, 0, 0.18);
  }

  @media (min-width: 640px) {
    .home {
      max-width: 1100px;
      padding: 32px 16px;
    }

    .home__grid--ready {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .home__card {
      min-height: 220px;
    }
  }
</style>
