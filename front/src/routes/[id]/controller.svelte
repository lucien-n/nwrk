<script lang="ts">
	import Controls from '$lib/components/controls.svelte';
	import Inventory from '$lib/components/inventory.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const handleCommand = ({ detail }: CustomEvent<string>) => {
		dispatch('cmd', detail);
	};
</script>

<div class="w-full h-full relative flex">
	<div class="absolute left-4 bottom-4">
		<Controls on:cmd={handleCommand} />
	</div>
	<div class="absolute right-4 bottom-4">
		<Inventory />
	</div>
</div>
