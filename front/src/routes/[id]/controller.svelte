<script lang="ts">
	import Compass from '$lib/components/compass.svelte';
	import Controls from '$lib/components/controls.svelte';
	import Coordinates from '$lib/components/coordinates.svelte';
	import FuelGauge from '$lib/components/fuel-gauge.svelte';
	import Inventory from '$lib/components/inventory.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	const handleCommand = ({ detail }: CustomEvent<string>) => {
		dispatch('cmd', detail);
	};
</script>

<div class="w-full h-full relative flex font-mono">
	<div class="absolute left-4 top-4">
		<Coordinates />
	</div>
	<div class="absolute w-full flex justify-center top-4">
		<Compass />
	</div>
	<div class="absolute right-4 top-4">
		<FuelGauge on:cmd={handleCommand} />
	</div>

	<div class="absolute left-4 bottom-4">
		<Controls on:cmd={handleCommand} />
	</div>
	<div class="absolute right-4 bottom-4">
		<Inventory on:cmd={handleCommand} />
	</div>
</div>
