<script lang="ts">
	import Control from './control.svelte';
</script>

<div class="grid gap-2 grid-cols-3 grid-rows-3 w-fit">
	<span />
	<Control key="w" />
	<span />
	<Control key="a" />
	<Control key="s" />
	<Control key="d" />
	<span class="col-span-3">
		<Control key=" " width="w-full" />
	</span>
</div>
