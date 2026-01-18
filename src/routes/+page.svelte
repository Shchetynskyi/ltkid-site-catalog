<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;

  function hrefFor(card: { category: string; gender: string }): string {
    const gender = card.gender === 'жіноча' ? 'жіноча' : 'чоловіча';

    // UX-FLOW v1.1:
    // ready  -> проміжний екран
    // frames -> одразу галерея
    if (card.category === 'ready') {
      return `/gallery/ready/${gender}/select`;
    }

    return `/gallery/${card.category}/${gender}`;
  }
</script>

<section>
  {#each data.cards as card}
    <a
      href={hrefFor(card)}
      data-sveltekit-preload-data="hover"
      data-sveltekit-preload-code="hover"
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
