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
    <div class="card__overlay">
      <div class="card__title">Підібрати під мій зір</div>
    </div>
  </a>

  <!-- SECONDARY -->
  <a class="card card--secondary" href={`/gallery/ready/${gender}`}>
    <div
      class="card__image"
      style={`background-image: url('/ready-select/${genderKey}/show-all.jpg?v=1');`}
    ></div>
    <div class="card__overlay">
      <div class="card__title">Показати всі</div>
    </div>
  </a>
</section>

<style>
  .ready-select {
    min-height: calc(100vh - var(--header-height, 0px));
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }

  /* 1:1 як на Home — картка керує формою, не фото */
  .card {
    position: relative;
    display: block;
    border-radius: 18px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    aspect-ratio: 1 / 1; /* мобільний: квадрат (як Home) */
  }

  /* desktop: дві картки поруч, як на Home */
  @media (min-width: 900px) {
    .ready-select {
      grid-template-columns: 1fr 1fr;
      align-items: start;
    }

    .card {
      aspect-ratio: 4 / 3; /* близько до Home-геометрії */
    }
  }

  .card__image {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center 20%;
    background-repeat: no-repeat;
  }

  .card__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 26px 26px 72px; /* ↑ підняли текст */
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.58),
    rgba(0, 0, 0, 0.22) 45%,
    rgba(0, 0, 0, 0.06) 70%,
    rgba(0, 0, 0, 0)
  );
}



  .card__title {
  color: #fff;
  font-weight: 700;
  font-size: clamp(28px, 4.6vw, 46px);
  line-height: 1.05;
  letter-spacing: 0.2px;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.45);
}



  .card--primary {
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.14);
    outline: 2px solid rgba(255, 135, 35, 0.22);
  }

  .card--secondary {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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
</style>
