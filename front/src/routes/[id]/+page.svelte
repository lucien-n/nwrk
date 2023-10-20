<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { initWebsocket } from '$lib/websocket';
	import { generateId } from '$lib/helper';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { SocketResponse } from '$lib/types';
	import { Loader2 } from 'lucide-svelte';
	import { turtleStore, worldStore } from '$lib/stores';
	import Controller from './controller.svelte';

	export let data: PageData;

	const { id } = data;
	const url = 'ws://localhost:8080';

	let ws: WebSocket;
	let state: 'connected' | 'disconnected' | 'connecting' | 'noturtle' | 'error' = 'disconnected';

	onMount(() => {
		connect();
	});

	const connect = () => {
		state = 'connecting';
		if (ws) ws.close();
		ws = initWebsocket(url, onOpen, onClose, onMessage);
	};

	const send = (cmd: string) => {
		const reqId = generateId();
		ws.send(JSON.stringify({ id: 'client', cmd, reqId, content: { name: 'Controller' } }));
	};

	const onOpen = (ev: Event) => {
		send('auth');
	};

	const onClose = (ev: CloseEvent) => {
		state = 'disconnected';
	};

	const onMessage = (ev: MessageEvent) => {
		const data = JSON.parse(ev.data) as SocketResponse;
		const { reqId, type, cmd, success, result, content } = data;

		if (type === 'auth') state = success ? 'connected' : 'error';
		else if (type === 'sync') sync(content);
	};

	const sync = (content?: any) => {
		if (!content) return;
		const { turtle, world } = content;
		turtleStore.set(turtle);
		worldStore.add(world);
	};
</script>

<div class="w-full h-full flex flex-col gap-3 items-center justify-center text-xl">
	{#if state === 'connected'}
		<Controller />
	{:else if state === 'connecting'}
		<h1 class="text-3xl">Connecting</h1>
		<span class="animate-spin"><Loader2 /></span>
	{:else if state === 'disconnected'}
		<h1 class="text-3xl">Disconnected</h1>
		<Button on:click={() => connect()}>Reconnect</Button>
	{:else if state === 'error'}
		<h1 class="text-3xl">Error while connecting to <a href={url}>{url}</a></h1>
	{/if}
</div>
