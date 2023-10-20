<script lang="ts">
	import { controlsEnabled } from '$lib/stores';
	import { createEventDispatcher } from 'svelte';
	import Button from './ui/button/button.svelte';
	import { cn } from '$lib/utils';

	export let key: string;
	export let width: 'w-16' | 'w-full' = 'w-16';

	const dispatch = createEventDispatcher();

	let pressed = false;

	const handleKeydown = (event: KeyboardEvent) => {
		if (!controlsEnabled) return;
		if (event.key.toLowerCase() !== key.toLowerCase()) return;

		pressed = true;
		dispatch('click');
	};

	const handleKeyup = (event: KeyboardEvent) => {
		if (!controlsEnabled) return;
		if (event.key.toLowerCase() !== key.toLowerCase()) return;

		pressed = false;
	};

	const handleClick = () => {
		if (!controlsEnabled) return;
		pressed = true;
		setTimeout(() => (pressed = false), 300);
	};
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />

<Button
	class={cn('relative h-16 m-0', width, pressed ? 'bg-red-500 hover:bg-red-400' : '')}
	on:click={handleClick}
>
	<slot />
	<p class="absolute top-0 left-0 mt-1 text-sm font-bold font-mono ml-2">
		{key === ' ' ? 'space' : key}
	</p>
</Button>
