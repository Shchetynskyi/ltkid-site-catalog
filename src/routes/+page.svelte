<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  function hrefFor(card: { category: string; gender: string }): string {
    const gender = card.gender === 'жіноча' ? 'жіноча' : 'чоловіча';

    // UX-FLOW v1.1:
    // ready  -> проміжний екран
    // frames -> одразу галерея
    if (card.category === 'ready') {
      return `/gallery/ready/${gender}/select`;
    }

    return `/gallery/${card.category}/${gender}`;
  }

  function titleFor(card: { category: string; gender: string }) {
    if (card.category === 'ready') {
      return card.gender === 'жіноча'
        ? 'Готові окуляри для жінок'
        : 'Готові окуляри для чоловіків';
    }

    return card.gender === 'жіноча' ? 'Жіночі оправи' : 'Чоловічі оправи';
  }
</script>

<section class="home">
  <div class="home__grid">
    {#each data.cards as card}
      <a
        href={hrefFor(card)}
        data-sveltekit-preload-data="hover"
        data-sveltekit-preload-code="hover"
        class="home__card"
      >
        <div class="home__card-title">{titleFor(card)}</div>
      </a>
    {/each}
  </div>
</section>

<style>
  .home {
    max-width: 720px; /* мобільний пріоритет */
    margin: 0 auto;
    padding: 16px;
  }

  .home__grid {
    display: grid;
    grid-template-columns: 1fr; /* мобільний 1 колонка */
    gap: 12px;
  }

  .home__card {
    display: block;
    padding: 18px 16px;
    border: 1px solid #ddd;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    background: #fff;
  }

  .home__card:active {
    border-color: #999;
  }

  .home__card-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
  }

  @media (min-width: 640px) {
    .home {
      max-width: 1100px;
      padding: 32px 16px;
    }

    .home__grid {
      grid-template-columns: repeat(2, minmax(240px, 1fr)); /* десктоп 2x2 */
      gap: 20px;
    }

    .home__card {
      padding: 24px;
    }

    .home__card:hover {
      border-color: #999;
    }
  }
</style>
