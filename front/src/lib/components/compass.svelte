<script lang="ts">
	import { turtleStore } from '$lib/stores';

	let direction = 0;

	turtleStore.subscribe((turtle) => {
		if (!turtle) return;
		direction = turtle.direction;
	});

	const getDirectionText = () => {
		if (direction == 0) return 'N';
		else if (direction == 1) return 'E';
		else if (direction == 2) return 'S';
		return 'W';
	};
</script>

<h1 class="text-3xl font-bold">
	{getDirectionText()}
</h1>
