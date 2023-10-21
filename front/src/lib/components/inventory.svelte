<script lang="ts">
	import { controlsEnabled, cooldownStore, createCoolDownStore } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	import Slot from './slot.svelte';

	export let selected: number = 0;

	const dispatch = createEventDispatcher();
	const cooldown = createCoolDownStore(500);
	const numberOfSlots = 16;

	let timeout: number = 0;

	const handleWheel = (ev: WheelEvent) => {
		if (!controlsEnabled) return;
		if (ev.deltaY < 0) selected = selected === 0 ? numberOfSlots - 1 : selected - 1;
		if (ev.deltaY > 0) selected = selected === numberOfSlots - 1 ? 0 : selected + 1;

		if (cooldown.isActive()) {
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(() => sync(), cooldown.timeLeft());
		} else cooldown.trigger();
	};

	const sync = () => {
		dispatch('cmd', `inventory:select:${selected + 1}`);
	};
</script>

<svelte:window on:wheel={handleWheel} />

<div class="grid grid-cols-4 grid-rows-4 gap-2">
	{#each { length: numberOfSlots } as _, i}
		<Slot slot={null} selected={i === selected} on:select={() => (selected = i)} />
	{/each}
</div>
