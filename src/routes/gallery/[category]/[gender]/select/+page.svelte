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
  <a class="btn" href={`/gallery/ready/${gender}`} aria-label="Показати всі"></a>
  <a class="btn" href={`/gallery/ready/${gender}/diopter`} aria-label="Підібрати за моїм зором"></a>
</section>

<style>
  .ready-select {
    min-height: calc(100vh - var(--header-height, 0px));
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 16px;
    padding: 16px;
  }

  .btn {
    display: block;
    border-radius: 18px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: rgba(0, 0, 0, 0.05);
  }
</style>
