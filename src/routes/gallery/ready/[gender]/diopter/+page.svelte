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

<section class="diopter">
  <div class="diopter__intro">
    <h1 class="diopter__title">Оберіть тип окулярів</h1>
    <p class="diopter__text">
      Це допоможе показати відповідні варіанти готових окулярів
    </p>
  </div>

  <div class="diopter__actions">
    <button class="btn plus" on:click={goPlus}>
      ➕ Плюсові
    </button>

    <button class="btn minus" on:click={goMinus}>
      ➖ Мінусові
    </button>

    <button class="btn unsure" on:click={goMessenger}>
      Уточнити з менеджером
    </button>
  </div>
</section>

<style>
  .diopter {
    min-height: calc(100vh - var(--header-height, 0px));
    display: flex;
    flex-direction: column;
    padding: 16px;
  }

  .diopter__intro {
    margin-bottom: 24px;
  }

  .diopter__title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .diopter__text {
    font-size: 14px;
    color: #555;
  }

  .diopter__actions {
    flex: 1;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 16px;
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
