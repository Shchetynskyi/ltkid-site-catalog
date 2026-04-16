<script lang="ts">
  import { goto } from '$app/navigation';

  function goPlus() {
    goto('/gallery/ready/all/diopter/plus');
  }

  function goMinus() {
    goto('/gallery/ready/all/diopter/minus');
  }

  function goPrescription() {
    goto('/prescription');
  }
</script>

<section class="entry">
  <h1>Готові ОКУЛЯРИ поштою! Післяплата!</h1>
  <h1>Які вам потрібні?</h1>

  <button on:click={goPlus}>
    Для читання (+ плюс)
  </button>

  <button on:click={goMinus}>
    Для дали (− мінус)
  </button>

  <button on:click={goPrescription}>
    За своїм рецептом
  </button>
</section>

<style>
  .entry {
    min-height: calc(100vh - 60px);
    padding: 24px 16px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 18px;
  }

  h1 {
    font-size: 28px;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 16px;
  }

  button {
    width: 100%;
    padding: 20px;

    font-size: 20px;
    font-weight: 700;

    border-radius: 16px;
    border: 2px solid #000;
    background: #fff;
  }

  button:active {
    transform: scale(0.98);
  }
</style>