<script lang="ts">
  import { page } from '$app/stores';
  import { redirect } from '@sveltejs/kit';
  import { get } from 'svelte/store';

  const p = get(page);

  if (p.params.category !== 'ready') {
    throw redirect(307, `/gallery/${p.params.category}/${p.params.gender}`);
  }

  const gender = p.params.gender;

  const genderKey =
    gender === 'жіноча' ? 'female' :
    gender === 'чоловіча' ? 'male' :
    gender;
</script>

<section class="home">
  <div class="home__grid home__grid--ready">
    <a
      href={`/gallery/ready/${gender}/diopter`}
      class="home__card"
      style={`background-image: url('/ready-select/${genderKey}/pick.jpg?v=1');`}
      aria-label="Підібрати під мій зір"
    >
      <div class="home__card-content">
        <div class="home__card-title-main">Підібрати</div>
        <div class="home__card-title-sub">під мій зір</div>
      </div>
    </a>

    <a
      href={`/gallery/ready/${gender}`}
      class="home__card"
      style={`background-image: url('/ready-select/${genderKey}/show-all.jpg?v=1');`}
      aria-label="Показати всі"
    >
      <div class="home__card-content">
        <div class="home__card-title-main">Показати</div>
        <div class="home__card-title-sub">всі</div>
      </div>
    </a>
  </div>
</section>

<style>
  .home {
    max-width: 720px;
    margin: 0 auto;
    padding: 16px;
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
  }

  /* 1:1 як Home */
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

    min-height: 150px;

    border-radius: 18px;
    text-decoration: none;
    color: #fff;

    border: 1px solid rgba(0, 0, 0, 0.12);

    background-size: cover;
    background-position: center 20%;
    background-repeat: no-repeat;
    overflow: hidden;
  }

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
    bottom: 12%;
    z-index: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    padding: 0 14px;
    text-align: center;
  }

  .home__card-title-main {
  font-size: 38px;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.home__card-title-sub {
  font-size: 34px;
  font-weight: 600;
  line-height: 1.1;
  opacity: 0.85;
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
  font-size: 46px;
}

.home__card-title-sub {
  font-size: 40px;
}

  }
</style>
