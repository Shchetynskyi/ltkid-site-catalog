<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>Model</h1>

{#if data.item}
	<p>{data.item.modelId}</p>
{:else}
	<p>Model not found</p>
{/if}
