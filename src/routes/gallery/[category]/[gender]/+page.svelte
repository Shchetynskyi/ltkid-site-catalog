<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import {
    FRAME_WIDTH_RANGES,
    type FrameWidthRangeKey,
    filterByFrameWidth
  } from '$lib/catalog/catalog.selectors';
  import { onMount } from 'svelte';
  import { galleryScrollKey } from '$lib/utils/scroll';

  export let data: {
    items: Array<{
      modelId: string;
      marketingTitle: string;
      previewImage?: string;
      price?: number | null;
      frameWidth?: number | null;
    }>;
  };

  const formatPrice = (value: number | null | undefined) => {
    if (value == null || Number.isNaN(value)) return '';
    return `${Math.round(value)} грн`;
  };

  const readRangeFromUrl = (): FrameWidthRangeKey => {
    const v = $page.url.searchParams.get('w');
    if (!v) return 'ALL';
    const ok = FRAME_WIDTH_RANGES.some((r) => r.key === v);
    return ok ? (v as FrameWidthRangeKey) : 'ALL';
  };

  let activeRange: FrameWidthRangeKey = readRangeFromUrl();

  $: {
    const next = readRangeFromUrl();
    if (next !== activeRange) activeRange = next;
  }

  $: visibleItems = filterByFrameWidth(data.items as any, activeRange);

  function setRange(key: FrameWidthRangeKey) {
    const url = new URL($page.url);
    if (key === 'ALL') url.searchParams.delete('w');
    else url.searchParams.set('w', key);

    goto(url.pathname + url.search, { replaceState: true, noScroll: true });
  }

  function showAll() {
    setRange('ALL');
  }

  onMount(() => {
    const key = galleryScrollKey($page);

    const saved = sessionStorage.getItem(key);
    if (saved) {
      requestAnimationFrame(() => {
        window.scrollTo(0, Number(saved));
      });
    }

    const onScroll = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>
