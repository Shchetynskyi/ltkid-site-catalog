<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { MANAGER_MESSENGER_URL } from '$lib/config/links';

  $: isHome = $page.url.pathname === '/';
</script>

<header class="site-header">
  <a
    class="home-link"
    href="/"
    aria-current={isHome ? 'page' : undefined}
  >
    Початок
  </a>

  <a
    class="manager-link"
    href={MANAGER_MESSENGER_URL}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Запитати менеджера у Messenger"
  >
    Запитати менеджера
  </a>
</header>

<slot />
