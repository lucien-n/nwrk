<script lang="ts">
	import { browser } from '$app/environment';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Loader2 } from 'lucide-svelte';

	const getIds = async (): Promise<string[]> => {
		if (!browser) return [];
		const res = await fetch(`http://localhost:8080/ids`);
		const ids = res.json();
		return ids;
	};
</script>

<section class="w-full h-full flex flex-col gap-2 items-center justify-center">
	{#await getIds()}
		<h1 class="text-3xl">Fetching ids</h1>
		<span class="animate-spin"><Loader2 /></span>
	{:then ids}
		{#if ids.length > 0}
			{#each ids as id}
				<Button href="/{id}"><p>Connect to <strong>{id}</strong></p></Button>
			{/each}
		{:else}
			<h1 class="text-3xl">No turtle currently online</h1>
			<Button href="/" data-sveltekit-reload>Refresh</Button>
		{/if}
	{/await}
</section>
