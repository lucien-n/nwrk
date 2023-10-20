<script lang="ts">
  import type { TSlot } from "./slot.type";

  export let slot: TSlot | null;
</script>

<div
  class="relative w-20 h-20 flex items-center justify-center text-center p-1 border-dashed border rounded-md"
>
  {#if slot}
    <p class="text-sm overflow-hidden">
      {slot.name.replace("minecraft:", "").split("_").join(" ")}
    </p>
    <div class="absolute bottom-0 right-0 p-[.125rem] pr-[.3rem] text-right">
      <p class="font-bold shadow-xl">{slot.count}</p>
    </div>
  {/if}
</div>
