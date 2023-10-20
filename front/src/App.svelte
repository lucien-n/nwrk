<script lang="ts">
  import { Canvas } from "@threlte/core";
  import { onMount } from "svelte";
  import "./app.postcss";
  import type { TBlock } from "./lib/block.type";
  import Controls from "./lib/Controls.svelte";
  import { generateId } from "./lib/helper";
  import { initSocket, type Socket } from "./lib/socket";
  import { cooldownStore, turtleStore, worldStore } from "./lib/stores";
  import WorldVisualizationScene from "./lib/WorldVisualizationScene.svelte";
  import CommandInput from "./lib/CommandInput.svelte";
  import type { TSlot } from "./lib/slot.type";
  import Inventory from "./lib/Inventory.svelte";

  let authenticated: boolean = false;
  let socket: Socket;

  onMount(() => connect());

  const connect = () => {
    if (socket) socket.ws.close();
    socket = initSocket(
      "ws://localhost:8080",
      () => {
        send("auth");
      },
      () => (authenticated = false),
      handleMessage
    );
  };

  type SocketResponse = {
    reqId: string;
    type: "auth" | "sync" | "response";
    cmd?: string;
    success?: boolean;
    result?: any;
    content: {
      turtle?: any;
      world?: any;
    };
  };

  const handleMessage = (event: MessageEvent<any>) => {
    const data = JSON.parse(event.data) as SocketResponse;
    const { reqId, type, cmd, success, result, content } = data;

    console.table(data);

    if (type === "sync") {
      const { turtle, world } = content;
      turtleStore.set(turtle);
      worldStore.add(world);
    } else if (type === "auth") {
      authenticated = success ?? false;
    } else if (type === "response") {
      console.log(reqId, cmd, result);
      if (cmd) {
        if (cmd.split(":")[0].startsWith("dig")) {
          worldStore.remove([
            { x: result.x, y: result.y, z: result.z } as TBlock,
          ]);
        }
      }
      console.log(`[${success ? "SUCCESS" : "FAIL"}] Response >`, result);
    }
  };

  const send = (cmd: string) => {
    if (cooldownStore.isActive()) return;
    const reqId = generateId();
    socket.send(JSON.stringify({ id: "client", cmd, reqId }));
  };
</script>

<main class="w-full h-full dark:bg-stone-900 dark:text-white overflow-hidden">
  <div
    class="relative w-full h-full mx-auto flex flex-col items-center justify-center gap-2"
  >
    {#if !authenticated}
      <h1 class="text-xl">Disconnected</h1>
      <button on:click={() => connect()} class="text-sm underline opacity-60"
        >retry</button
      >
    {:else if $turtleStore && $turtleStore?.id !== "undefined"}
      <div class="flex justify-center h-full w-full">
        <div class="absolute left-0 bottom-0 m-4">
          <Inventory />
        </div>
        <div class="absolute top-0 w-full flex justify-center m-4">
          <CommandInput
            on:cmd={(event) => {
              send(event.detail);
            }}
          />
        </div>
        <div class="absolute bottom-0 w-full flex justify-center m-4">
          <Controls
            on:cmd={(event) => {
              send(event.detail);
            }}
          />
        </div>
        <div class="w-screen h-screen">
          <Canvas>
            <WorldVisualizationScene />
          </Canvas>
        </div>
      </div>
    {:else}
      <h1 class="text-2xl">
        <strong>Turtle offline</strong>
      </h1>
    {/if}
  </div>
</main>
