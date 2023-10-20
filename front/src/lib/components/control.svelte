<script lang="ts">
	import { controlsEnabled, cooldownStore } from '$lib/stores';
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import Button from './ui/button/button.svelte';

	export let key: string;
	export let width: 'w-16' | 'w-full' = 'w-16';

	const dispatch = createEventDispatcher();

	let pressed = false;
	let isOnCooldown = false;

	const handleKeydown = (event: KeyboardEvent) => {
		if (!controlsEnabled) return;
		if (event.key.toLowerCase() !== key.toLowerCase()) return;

		pressed = true;
		click();
	};

	const handleKeyup = (event: KeyboardEvent) => {
		if (!controlsEnabled) return;
		if (event.key.toLowerCase() !== key.toLowerCase()) return;

		pressed = false;
	};

	const handleClick = () => {
		if (!controlsEnabled) return;
		click();
	};

	const click = () => {
		if (cooldownStore.isActive()) {
			isOnCooldown = true;
			setTimeout(() => (isOnCooldown = false), cooldownStore.timeLeft());
		} else {
			dispatch('click');
			cooldownStore.trigger();
		}

		pressed = true;
		setTimeout(() => (pressed = false), 300);
	};
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />

<Button
	class={cn(
		'relative h-16 m-0',
		width,
		pressed ? 'bg-red-500 hover:bg-red-400' : '',
		isOnCooldown ? 'bg-blue-500' : ''
	)}
	on:click={handleClick}
>
	<div class="text-lg flex justify-center items-center font-bold font-mono">
		{key.toLowerCase() === ' ' ? 'space' : key.toUpperCase()}
	</div>
	<p class="absolute scale-75 top-0 left-0 m-[.12rem]">
		<slot />
	</p>
</Button>
