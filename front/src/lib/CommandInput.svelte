<script lang="ts">
  import { ChevronDown, ChevronUp, Send } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";
  import { keyboardControlEnabled } from "./stores";
  import { fade, fly } from "svelte/transition";

  const dispatch = createEventDispatcher();

  let showInput: boolean = false;
  let command: string = "";

  const onClick = () => {
    if (command) dispatch("cmd", command);
  };
</script>

<section class="flex flex-col w-full lg:w-2/3">
  {#if showInput}
    <section
      in:fly={{ y: -200, duration: 200 }}
      out:fly={{ y: -200, duration: 200 }}
      class="flex gap-3 h-fit w-full"
    >
      <input
        on:focusin={() => keyboardControlEnabled.set(false)}
        on:focusout={() => keyboardControlEnabled.set(true)}
        bind:value={command}
        type="text"
        placeholder="command (ex: 'move:up')"
        class="w-full border border-dashed bg-transparent text-white"
      />
      <button
        class="p-2 flex items-center border-dashed border"
        on:click={onClick}
      >
        <Send />
      </button>
    </section>
  {/if}
  {#key showInput}
    <button
      in:fade={{ duration: 200, delay: 200 }}
      class="mx-auto hover:bg-transparent active:outline-none"
      on:click={() => (showInput = !showInput)}
    >
      {#if showInput}
        <ChevronUp />
      {:else}
        <ChevronDown />
      {/if}
    </button>
  {/key}
</section>
