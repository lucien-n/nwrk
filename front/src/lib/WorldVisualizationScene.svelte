<script lang="ts">
  import { T } from "@threlte/core";
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { turtleStore, worldStore } from "./stores";
  import type { TBlock } from "./block.type";
  import { distanceVec } from "./helper";

  const colors: string[] = [
    "white",
    "light_gray",
    "gray",
    "black",
    "brown",
    "red",
    "orange",
    "yellow",
    "lime",
    "green",
    "cyan",
    "aqua",
    "blue",
    "purple",
    "magenta",
    "pink",
  ]; // light gray and light blue are problematic

  let pos = new THREE.Vector3(0, 0, 0);
  let dir: number = 0;

  let cameraRef: THREE.PerspectiveCamera | undefined;
  let getBlocks: TBlock[] = [];

  onMount(() => {
    turtleStore.subscribe((turtle) => {
      if (!turtle) return;
      const { id, x, y, z, direction, fuelLevel } = turtle;
      pos = new THREE.Vector3(x, y, z);
      dir = direction;
    });
  });

  worldStore.subscribe((blocks) => (getBlocks = blocks));

  const getBlockColor = (block: TBlock) => {
    let blockColor = "beige";
    if (!block.name) return blockColor;

    for (const color of colors) {
      if (block.name.includes("light_gray")) return "lightgray";
      if (block.name.includes("light_blue")) return "lightblue";
      if (block.name.includes("pink")) return "hotpink";
      if (block.name.includes(color)) return color;

      continue;
    }

    return blockColor;
  };

  const getBlockOpacity = (block: TBlock) => {
    if (block.y === pos.y + 1) return 0.1;
    if (block.y === pos.y + 2) return 0.05;
    if (block.y > pos.y + 2) return 0;

    const dist = distanceVec(
      [pos.x, pos.y, pos.z],
      [block.x, block.y, block.z]
    );
    const opacity = dist === 1 ? 1 : THREE.MathUtils.clamp(1 - dist / 10, 0, 1);
    return opacity;
  };
</script>

<T.PerspectiveCamera
  makeDefault
  position={[pos.x + 16, pos.y + 16, pos.z + 16]}
  bind:ref={cameraRef}
  on:create={({ ref }) => ref.lookAt(new THREE.Vector3(pos.x, pos.y, pos.z))}
/>

<T.DirectionalLight
  position={[pos.x + 10, pos.y + 10, pos.z + 10]}
  intensity={5}
/>

<T.Mesh position={[pos.x, pos.y, pos.z]}>
  <T.BoxGeometry args={[0.8, 0.8, 0.8]} />
  <T.MeshPhongMaterial color="rebeccapurple" transparent opacity={0.9} />
</T.Mesh>

{#each getBlocks as block}
  {@const color = getBlockColor(block)}
  {@const opacity = getBlockOpacity(block)}
  <T.Mesh position={[block.x, block.y, block.z]}>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshPhongMaterial transparent {color} {opacity} />
  </T.Mesh>
{/each}
