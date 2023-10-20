<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { initWebsocket } from '$lib/websocket';
	import { generateId } from '$lib/helper';

	export let data: PageData;

	const { id } = data;

	let ws: WebSocket;

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

<h1>Controlling {id}</h1>
