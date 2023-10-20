<script lang="ts">
	import type { Slot } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import Button from './ui/button/button.svelte';
	import { cn } from '$lib/utils';

	export let slot: Slot | null;
	export let selected: boolean;

	const dispatch = createEventDispatcher();

	const handleClick = () => {
		dispatch('select');
	};
</script>

<Button
	class={cn(
		'relative w-16 h-16 m-0',
		selected ? 'outline outline-offset-2 bg-red-500 hover:bg-red-400' : ''
	)}
	on:click={handleClick}
>
	{#if slot}
		<p class="absolute top-0 left-0 mt-1 text-sm font-bold font-mono ml-2">
			{slot.count}
		</p>
	{/if}
</Button>
