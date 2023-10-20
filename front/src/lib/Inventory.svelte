<script lang="ts">
  import Slot from "./Slot.svelte";
  import { turtleStore } from "./stores";
</script>

<section class="grid grid-cols-4 grid-rows-4 gap-2">
  {#if $turtleStore}
    {#each $turtleStore.inventory as slot}
      <Slot {slot} />
    {/each}
  {/if}
</section>
