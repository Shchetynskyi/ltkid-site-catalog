<script lang="ts">
  import { MANAGER_MESSENGER_URL } from '$lib/config/links';
</script>

<header class="site-header">
  <a class="home-link" href="/">Початок</a>

  <a
    class="manager-link"
    href={MANAGER_MESSENGER_URL}
    target="_blank"
    rel="noopener noreferrer"
  >
    Запитати менеджера
  </a>
</header>

<slot />
