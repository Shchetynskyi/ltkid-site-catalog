<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { gallerySingleColumn, showGalleryViewToggle } from '$lib/stores/galleryView';
  import { onMount } from 'svelte';

  $: isHome = $page.url.pathname === '/';

  
</script>

<header class="site-header">
  <a
    class="home-link"
    href="/"
    aria-current={isHome ? 'page' : undefined}
  >
    ← Початок
  </a>

  {#if $showGalleryViewToggle}
    <button
      type="button"
      class="header-view-toggle"
      on:click={() => gallerySingleColumn.update(v => !v)}
    >
      {$gallerySingleColumn ? '2 колонки' : '1 колонка'}
    </button>
  {/if}
</header>

<slot />

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 20;
    background: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .home-link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 10px 16px 10px 12px;

    font-size: 14px;
    font-weight: 700;
    color: #111;
    text-decoration: none;
  }

  .home-link:hover {
    text-decoration: underline;
  }

  .header-view-toggle {
    border: 1px solid rgba(0,0,0,0.14);
    background: #fff;
    border-radius: 999px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    margin-right: 12px;
  }
</style>