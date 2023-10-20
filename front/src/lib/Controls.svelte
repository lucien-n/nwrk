<script lang="ts">
  import {
    ArrowDown,
    ArrowDownFromLine,
    ArrowUp,
    ArrowUpFromLine,
    CornerUpLeft,
    CornerUpRight,
  } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";
  import ControlButton from "./ControlButton.svelte";

  const dispatch = createEventDispatcher();
</script>

<div class="grid grid-flow-col grid-cols-5 grid-rows-3 w-fit gap-2">
  <!-- Dig -->
  <ControlButton key="j" on:click={() => dispatch("cmd", "dig:up")}>
    <ArrowUp />
    ⛏
  </ControlButton>
  <ControlButton key="k" on:click={() => dispatch("cmd", "dig:front")}>
    ⛏
  </ControlButton>
  <ControlButton key="l" on:click={() => dispatch("cmd", "dig:down")}>
    <ArrowDown />
    ⛏
  </ControlButton>
  <!-- Movement -->
  <ControlButton key="q" on:click={() => dispatch("cmd", "move:down")}>
    <ArrowDownFromLine />
  </ControlButton>
  <ControlButton key="a" on:click={() => dispatch("cmd", "turn:left")}>
    <CornerUpLeft />
  </ControlButton>
  <span />
  <ControlButton key="w" on:click={() => dispatch("cmd", "move:forward")}>
    <ArrowUp />
  </ControlButton>
  <ControlButton key="s" on:click={() => dispatch("cmd", "move:back")}>
    <ArrowDown />
  </ControlButton>
  <span />
  <ControlButton key="e" on:click={() => dispatch("cmd", "move:up")}>
    <ArrowUpFromLine />
  </ControlButton>
  <ControlButton key="d" on:click={() => dispatch("cmd", "turn:right")}>
    <CornerUpRight />
  </ControlButton>
  <span />
  <!-- Inspect -->
  <ControlButton key="j" on:click={() => dispatch("cmd", "inspect:up")}>
    <ArrowUp />
    🔍
  </ControlButton>
  <ControlButton key="k" on:click={() => dispatch("cmd", "inspect:front")}>
    🔍
  </ControlButton>
  <ControlButton key="l" on:click={() => dispatch("cmd", "inspect:down")}>
    <ArrowDown />
    🔍
  </ControlButton>
</div>
