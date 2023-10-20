<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const { id } = data;
	console.log(id);
</script>
