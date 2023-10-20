<script lang="ts">
	import { turtleStore } from '$lib/stores';
	import { Fuel } from 'lucide-svelte';

	export let maxFuelLevel: number = 100_000;

	let gauge: HTMLElement;
	let percentage = 33;

	turtleStore.subscribe((turtle) => {
		if (!turtle) return;
		const { fuelLevel } = turtle;
		percentage = ((maxFuelLevel - fuelLevel) / maxFuelLevel) * 100;
	});

	$: if (gauge) gauge.style.width = `${percentage}%`;
</script>

<section class="flex gap-2 items-center">
	<Fuel />
	<div class="rounded-md bg-primary w-60 grid-cols-10 grid p-1 rotate-180">
		<div bind:this={gauge} class="col-span-10 w-full h-full bg-red-500 rounded-[3px] text-center">
			<p class="rotate-180 text-white font-bold">
				{percentage}%
			</p>
		</div>
	</div>
</section>
