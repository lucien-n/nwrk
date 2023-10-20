<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { initWebsocket } from '$lib/websocket';
	import { generateId } from '$lib/helper';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data: PageData;

	const { id } = data;

	let ws: WebSocket;
	let state: 'connected' | 'disconnected' | 'waiting' | 'noturtle' = 'disconnected';

	onMount(() => {
		connect();
	});

	const connect = () => {
		if (ws) ws.close();
		ws = initWebsocket('ws://localhost:8080', onOpen, onClose, onMessage);
	};

	const send = (cmd: string) => {
		const reqId = generateId();
		ws.send(JSON.stringify({ id: 'client', cmd, reqId, content: { name: 'Controller' } }));
	};

	const onOpen = (ev: Event) => {
		send('auth');
	};

	const onClose = (ev: CloseEvent) => {};

	const onMessage = (ev: MessageEvent) => {};
</script>

{#if state === 'connected'}
	<h1>Controlling {id}</h1>
{:else if state === 'disconnected'}
	<div class="w-full h-full flex flex-col gap-3 items-center justify-center">
		<h1 class="text-3xl">Disconnected</h1>
		<Button on:click={() => connect()}>Reconnect</Button>
	</div>
{/if}
