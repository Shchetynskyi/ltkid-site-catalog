<!-- src/routes/gallery/[category]/[gender]/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<section>
  <h1>Gallery</h1>

  {#if data.items.length === 0}
    <p>Немає моделей</p>
  {:else}
    <ul style="list-style: none; padding: 0; margin: 0;">
      {#each data.items as item}
        <li style="margin-bottom: 16px;">
          <a href={`/model/${item.modelId}`} style="text-decoration: none; color: inherit;">
            {#if item.previewImage}
              <img
                src={item.previewImage}
                alt={item.marketingTitle || item.modelId}
                style="width: 100%; max-width: 300px; height: auto; display: block;"
              />
            {/if}
            <strong>{item.marketingTitle || item.modelId}</strong>
            <div>Ціна: {item.price} грн</div>
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</section>
