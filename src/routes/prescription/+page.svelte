<script lang="ts">
  import { goto } from '$app/navigation';

  function goManager() {
    window.location.href = 'https://m.me/101402489688578';
  }

  function goFrames() {
    goto('/gallery/frames/all');
  }
</script>

<section class="entry">
  <h1>Окуляри за рецептом</h1>

  <button on:click={goManager}>
    Звʼязатися з менеджером
  </button>

  <button on:click={goFrames}>
    Обрати оправу під свій рецепт
  </button>
</section>

<style>
  .entry {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

  h1 {
    font-size: 24px;
    font-weight: 900;
  }

  button {
    width: 100%;
    padding: 18px;
    font-size: 18px;
    font-weight: 800;
    border-radius: 12px;
    border: 1px solid #000;
    background: #fff;
  }
</style>