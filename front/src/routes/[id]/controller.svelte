<script lang="ts">
	import Controls from '$lib/components/controls.svelte';
	import Inventory from '$lib/components/inventory.svelte';
</script>

<div class="w-full h-full relative flex">
	<div class="absolute left-4 bottom-4">
		<Controls />
	</div>
	<div class="absolute right-4 bottom-4">
		<Inventory />
	</div>
</div>
