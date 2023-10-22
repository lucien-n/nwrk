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
		'relative w-20 h-20 m-0 p-1',
		selected ? 'outline outline-offset-2 bg-red-500 hover:bg-red-400' : ''
	)}
	on:click={handleClick}
>
	{#if slot}
		<div class="text-sm w-full h-full flex flex-col justify-center items-center text-center">
			{#each slot.name.split(/:|_/).slice(1) as word}
				<p>
					{word}
				</p>
			{/each}
		</div>
		<p class="absolute top-0 left-0 m-1 text-sm font-bold font-mono">
			{slot.count}
		</p>
	{/if}
</Button>
