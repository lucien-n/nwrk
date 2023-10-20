<script lang="ts">
  import { cooldownStore, keyboardControlEnabled } from "./stores";
  import { createEventDispatcher } from "svelte";

  export let key: string;

  let isPressed: boolean = false;
  let isOnCooldown: boolean = false;

  const dispatch = createEventDispatcher();

  const handleKeydown = (e: KeyboardEvent) => {
    if (!$keyboardControlEnabled) return;
    isPressed = e.key === key;
    if (isPressed) handleClick();
  };

  const handleKeyup = (e: KeyboardEvent) => {
    if (!$keyboardControlEnabled) return;
    if (e.key !== key) return;
    isPressed = false;
  };

  const handleClick = () => {
    if (cooldownStore.isActive()) {
      isOnCooldown = true;
      setTimeout(() => (isOnCooldown = false), cooldownStore.timeLeft());
    } else {
      dispatch("click");
      cooldownStore.trigger();
    }
  };
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />

<button
  class:active={isPressed && !isOnCooldown}
  class:cooldown={isOnCooldown}
  class="flex justify-center items-center w-16 h-16 p-0 outline-dashed outline-1"
  on:click={handleClick}><slot /></button
>

<style lang="postcss">
  .active {
    @apply outline outline-1 bg-blue-600;
  }

  .cooldown {
    @apply outline outline-1 bg-orange-600;
  }
</style>
