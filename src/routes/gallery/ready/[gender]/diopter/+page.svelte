<script lang="ts">
  import { page } from '$app/stores';

  const gender = $page.params.gender;

  function goPlus() {
    window.location.href = `/gallery/ready/${gender}/diopter/plus`;
  }

  function goMinus() {
    window.location.href = `/gallery/ready/${gender}/diopter/minus`;
  }

  function goMessenger() {
    window.location.href = import.meta.env.VITE_MESSENGER_URL;
  }
</script>

<section class="diopter-start">
  <button class="btn plus" on:click={goPlus}>
    ➕ Плюсові
  </button>

  <button class="btn minus" on:click={goMinus}>
    ➖ Мінусові
  </button>

  <button class="btn unsure" on:click={goMessenger}>
    Уточнити з менеджером
  </button>
</section>

<style>
  .diopter-start {
    min-height: calc(100vh - var(--header-height, 0px));
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 16px;
    padding: 16px;
  }

  .btn {
    border-radius: 18px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    background: rgba(0, 0, 0, 0.05);
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
  }

  .plus {
    background: #e6f4ff;
  }

  .minus {
    background: #ffecec;
  }

  .unsure {
    background: #f2f2f2;
  }
</style>
