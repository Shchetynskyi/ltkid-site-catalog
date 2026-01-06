<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>Home</h1>
<p>{data.items.length} items loaded</p>
<p>{data.cards.length} cards configured</p>
