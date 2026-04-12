<script lang="ts">
  import { goto } from '$app/navigation';

  function goPlus() {
    goto('/gallery/ready/all/diopter/plus');
  }

  function goMinus() {
    goto('/gallery/ready/all/diopter/minus');
  }
</script>

<div style="padding:20px; display:flex; flex-direction:column; gap:16px;">
  <button on:click={goPlus}>Для читання (+)</button>
  <button on:click={goMinus}>Для дали (−)</button>
</div>