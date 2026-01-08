<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { MANAGER_MESSENGER_URL } from '$lib/config/links';

  $: isHome = $page.url.pathname === '/';

  function normalizeBase(raw: string): string {
    const trimmed = (raw ?? '').trim();
    if (!trimmed) return 'https://m.me/101402489688578';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed.replace(/^\/+/, '')}`;
  }

  function buildManagerUrl(pathname: string): string {
    const match = pathname.match(/^\/model\/([^/]+)$/);
    const modelId = match?.[1];

    const ref = modelId
      ? `site_catalog__model_${modelId}`
      : `site_catalog__from_site`;

    const base = normalizeBase(MANAGER_MESSENGER_URL);
    const url = new URL(base);
    url.searchParams.set('ref', ref);

    return url.toString();
  }

  $: managerUrl = buildManagerUrl($page.url.pathname);
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
    href={managerUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Звʼязатися з менеджером у Messenger"
  >
    Звʼязатися з менеджером
  </a>
</header>

<slot />
