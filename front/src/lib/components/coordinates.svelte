<script lang="ts">
	import { turtleStore } from '$lib/stores';

	let x = 0;
	let y = 0;
	let z = 0;

	turtleStore.subscribe((turtle) => {
		if (!turtle) return;
		x = turtle.x;
		y = turtle.y;
		z = turtle.z;
	});
</script>

<section class="bg-primary rounded-md gap-2 px-3 py-2 text-white grid grid-cols-4 grid-rows-3">
	<strong>x:</strong>
	<p class="col-span-3 text-right">{x}</p>
	<strong>y:</strong>
	<p class="col-span-3 text-right">{y}</p>
	<strong>z:</strong>
	<p class="col-span-3 text-right">{z}</p>
</section>
