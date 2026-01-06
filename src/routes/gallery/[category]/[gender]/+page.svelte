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
          <div>
            <strong>{item.marketingTitle || item.modelId}</strong>
          </div>
          <div>
            {item.price} грн
          </div>
        </a>
      </li>
    {/each}
  </ul>
</section>
