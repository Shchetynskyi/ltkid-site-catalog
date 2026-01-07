<script lang="ts">
  import { managerLink } from '$lib/config/links';
</script>

<header class="site-header">
  <a class="home-link" href="/">Початок</a>

  <a
    class="manager-link"
    href={managerLink}
    target="_blank"
    rel="noopener noreferrer"
  >
    Запитати менеджера
  </a>
</header>

<slot />
