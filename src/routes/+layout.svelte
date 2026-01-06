<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { MANAGER_MESSENGER_URL } from '$lib/config/links';
</script>

<header>
  <div>
    <a href="/">Початок</a>
  </div>

  <div>
    <a href={MANAGER_MESSENGER_URL} target="_blank" rel="noopener">
      Запитати менеджера
    </a>
  </div>
</header>

<main>
  <slot />
</main>
