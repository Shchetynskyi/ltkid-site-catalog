<!-- src/routes/gallery/[category]/[gender]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<section>
  <h1>Gallery</h1>
  <p>{data.items.length} items</p>

  <ul>
    {#each data.items as item}
      <li>
        <a href={`/model/${item.modelId}`}>
          {item.marketingTitle || item.modelId}
        </a>
      </li>
    {/each}
  </ul>
</section>
