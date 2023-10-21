<script lang="ts">
	import { turtleStore } from '$lib/stores';
	import { cn } from '$lib/utils';
	import { Fuel } from 'lucide-svelte';

	let gauge: HTMLElement;
	let percentage = 33;

	turtleStore.subscribe((turtle) => {
		if (!turtle) return;
		const { fuelLevel } = turtle;
		percentage = Math.floor(fuelLevel);
	});

	$: if (gauge) gauge.style.width = `${percentage}%`;
</script>

<section class="flex gap-2 items-center">
	<Fuel />
	<div class="relative rounded-md bg-primary w-60 grid-cols-10 grid p-1 rotate-180">
		<div
			bind:this={gauge}
			class="col-span-10 w-full h-5 bg-red-500 rounded-[3px] text-center flex items-center"
		>
			<p class="rotate-180 text-white font-bold mx-1">
				{percentage}%
			</p>
		</div>
	</div>
</section>
