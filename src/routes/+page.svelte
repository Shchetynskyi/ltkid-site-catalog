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
        class="home__card {card.gender === 'жіноча' ? 'is-female' : 'is-male'}"
        aria-label={titleFor(card)}
      >
        <div class="home__card-content">
          <div class="home__card-title-main">
            {card.gender === 'жіноча' ? 'Жіночі' : 'Чоловічі'}
          </div>
          <div class="home__card-title-sub">Готові окуляри</div>
        </div>
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

  /* READY_ONLY = 2 сцени */
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

    /* Phase 5.3: менші, але масивні */
    min-height: 150px;

    border-radius: 18px;
    text-decoration: none;
    color: #fff;

    border: 1px solid rgba(0, 0, 0, 0.12);

    /* фото-фон */
    background-size: cover;
    background-position: center 20%;
    background-repeat: no-repeat;
    overflow: hidden;
  }

  /* Phase 5.3: фото з static/ */
  .home__card.is-female {
    background-image: url('/home-female.jpg');
  }
  .home__card.is-male {
    background-image: url('/home-male.jpg');
  }

  /* Overlay для читабельності */
  .home__card::before {
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



  .home__card-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 12%; /* текст опускаємо вниз, не перекриває обличчя */
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  padding: 0 14px;
  text-align: center;
}


  /* Типографіка: крупно, без дрібного */
  .home__card-title-main {
    font-size: 34px;
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
  }

  .home__card-title-sub {
    font-size: 28px;
    font-weight: 700;
    line-height: 1.15;
    opacity: 0.95;
  }

  .home__card:active {
    border-color: rgba(255, 255, 255, 0.35);
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
      min-height: 190px;
      border-radius: 22px;
    }

    .home__card-title-main {
      font-size: 40px;
    }

    .home__card-title-sub {
      font-size: 20px;
    }
  }
</style>
