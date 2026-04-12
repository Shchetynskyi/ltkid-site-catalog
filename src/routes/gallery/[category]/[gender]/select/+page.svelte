<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';

  onMount(() => {
    const p = get(page);
    goto(`/gallery/ready/${p.params.gender}/diopter`, { replaceState: true });
  });
</script>