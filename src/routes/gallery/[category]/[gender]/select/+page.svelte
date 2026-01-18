<script lang="ts">
  import { page } from '$app/stores';
  import { redirect } from '@sveltejs/kit';

  // Дозволено ТІЛЬКИ для ready. Для інших категорій — назад у галерею.
  if ($page.params.category !== 'ready') {
    throw redirect(307, `/gallery/${$page.params.category}/${$page.params.gender}`);
  }

  const gender = $page.params.gender;
</script>

<section class="ready-select">
  <a
    class="card"
    href={`/gallery/ready/${gender}`}
  >
    <div class="card__title">Показати всі</div>
  </a>

  <a
    class="card"
    href={`/gallery/ready/${gender}/diopter`}
  >
    <div class="card__title">Підібрати під мій зір</div>
  </a>
</section>

<style>
  .ready-select {
    min-height: calc(100vh - var(--header-height, 0px));
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 16px;
    padding: 16px;
  }

  .card {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 18px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: rgba(0, 0, 0, 0.05);
    text-decoration: none;
    color: inherit;
  }

  .card__title {
    font-size: 18px;
    font-weight: 600;
  }
</style>
