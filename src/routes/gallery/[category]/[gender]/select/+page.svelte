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

<section class="ready-select">
  <!-- PRIMARY -->
  <a class="card card--primary" href={`/gallery/ready/${gender}/diopter`}>
    <div
      class="card__image"
      style={`background-image: url('/ready-select/${genderKey}/pick.jpg?v=1');`}
    ></div>
    <div class="card__content">
      <div class="card__title">Підібрати під мій зір</div>
    </div>
  </a>

  <!-- SECONDARY -->
  <a class="card card--secondary" href={`/gallery/ready/${gender}`}>
    <div
      class="card__image"
      style={`background-image: url('/ready-select/${genderKey}/show-all.jpg?v=1');`}
    ></div>
    <div class="card__content">
      <div class="card__title">Показати всі</div>
    </div>
  </a>
</section>

<style>
  /* Мобільний first */
  .ready-select {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }

  .card {
    position: relative;
    display: block;
    border-radius: 18px;
    overflow: hidden;
    text-decoration: none;

    /* Стабільна геометрія, ближче до Home */
    min-height: 170px;
    height: 36vh;
    max-height: 300px;

    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.10);
    border: 1px solid rgba(0, 0, 0, 0.12);
  }

  .card__image {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center 20%;
    background-repeat: no-repeat;
  }

  /* Плашка — як на Home */
  .card__content {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 14px;
    z-index: 1;

    padding: 10px 14px;
    text-align: center;

    background: rgba(0, 0, 0, 0.45);
    border-radius: 14px;

    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .card__title {
    color: #fff;
    font-weight: 700;
    font-size: clamp(26px, 5.6vw, 40px);
    line-height: 1.12;
    letter-spacing: -0.01em;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
  }

  .card--primary {
    outline: 2px solid rgba(255, 135, 35, 0.22);
  }

  .card--secondary {
    outline: 1px solid rgba(0, 0, 0, 0.08);
  }

  @media (hover: hover) {
    .card {
      transition: transform 0.12s ease, box-shadow 0.15s ease;
    }
    .card:hover {
      transform: scale(1.01);
    }
  }

  .card:active {
    transform: scale(0.99);
  }

  /* Desktop */
  @media (min-width: 900px) {
    .ready-select {
      grid-template-columns: 1fr 1fr;
      align-items: start;
      gap: 20px;
      padding: 16px;
    }

    .card {
      height: 320px;
      max-height: none;
      border-radius: 22px;
    }
  }
</style>
