<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Control from './control.svelte';
	import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-svelte';

	const dispatch = createEventDispatcher();
</script>

<div class="grid gap-2 grid-cols-3 w-fit">
	<Control key="q" on:click={() => dispatch('cmd', 'move:down')}>
		<ArrowDownFromLine />
	</Control>
	<Control key="w" on:click={() => dispatch('cmd', 'move:forward')} />
	<Control key="e" on:click={() => dispatch('cmd', 'move:up')}>
		<ArrowUpFromLine />
	</Control>
	<Control key="a" on:click={() => dispatch('cmd', 'turn:left')} />
	<Control key="s" on:click={() => dispatch('cmd', 'move:back')} />
	<Control key="d" on:click={() => dispatch('cmd', 'turn:right')} />
</div>
