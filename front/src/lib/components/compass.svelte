<script lang="ts">
	import { turtleStore } from '$lib/stores';
	import { onMount } from 'svelte';

	let direction = 0;

	const getDirectionText = (dir: number) => {
		if (dir == 0) return 'N';
		else if (dir == 1) return 'E';
		else if (dir == 2) return 'S';
		return 'W';
	};

	onMount(() => {
		turtleStore.subscribe((turtle) => {
			if (!turtle) return;
			direction = turtle.direction;
		});
	});
</script>

<h1 class="text-3xl font-bold">
	{getDirectionText(direction)}
</h1>
