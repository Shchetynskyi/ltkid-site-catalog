<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { MANAGER_MESSENGER_URL } from '$lib/config/links';
  import { managerLeadPayload } from '$lib/lead/managerContext.store';

  $: isHome = $page.url.pathname === '/';

  function normalizeBase(raw: string): string {
    const trimmed = (raw ?? '').trim();
    if (!trimmed) return 'https://m.me/101402489688578';
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed.replace(/^\/+/, '')}`;
  }

  function buildManagerUrl(pathname: string): string {
    const base = normalizeBase(MANAGER_MESSENGER_URL);
    const url = new URL(base);

    const payload = get(managerLeadPayload);

    if (payload) {
      // LeadPayload v1 (canonical)
      url.searchParams.set('ref', payload.ref);
      url.searchParams.set('ModelID', payload.ModelID);
      url.searchParams.set('MarketingTitle', payload.MarketingTitle);
      url.searchParams.set('SitePriceUAH', payload.SitePriceUAH);
      url.searchParams.set('Image', payload.Image);

      if (payload.DiopterContext) {
        url.searchParams.set('DiopterContext', payload.DiopterContext);
      }

      return url.toString();
    }

    // Fallback for non-model pages (Phase 2 safe)
    url.searchParams.set('ref', 'site_catalog__from_site');
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
