<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<section>
  {#each data.cards as card}
    <a
      href={`/gallery/${card.category}/${card.gender}`}
      style="display:block; margin:12px 0; padding:16px; border:1px solid #ccc;"
    >
      <div>
        <strong>
          {card.category === 'ready' ? 'Готові окуляри' : 'Оправи'}
        </strong>
      </div>
      <div>
        {card.gender === 'жіноча' ? 'Жіночі' : 'Чоловічі'}
      </div>
    </a>
  {/each}
</section>
