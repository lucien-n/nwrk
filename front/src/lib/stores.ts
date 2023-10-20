import { writable } from 'svelte/store';
import type { Block, Turtle } from './types';

export const controlsEnabled = writable<boolean>(true);
export const turtleStore = writable<Turtle | null>(null);

const createWorldStore = () => {
	const { subscribe, set, update } = writable<Block[]>([]);

	const comparePos = (a: Block, b: Block) => a.x === b.x && a.y === b.y && a.z === b.z;

	const add = (newBlocks: Block[]) => {
		update((blocks) => {
			for (const newBlock of newBlocks) {
				blocks = blocks.filter((block) => !comparePos(block, newBlock));
				blocks.push(newBlock);
			}

			return blocks;
		});
	};

	const remove = (blocksToRemove: Block[]) => {
		if (!blocksToRemove) return;
		update((blocks) => {
			for (const blockToRemove of blocksToRemove) {
				blocks = blocks.filter((block) => !comparePos(blockToRemove, block));
			}

			return blocks;
		});
	};

	return {
		subscribe,
		set,
		update,
		add,
		remove
	};
};

export const worldStore = createWorldStore();
