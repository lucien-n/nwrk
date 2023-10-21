import { writable } from 'svelte/store';
import type { Block, Turtle } from './types';
import { now } from './helper';

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

type TCooldown = {
	lastTriggerMs: number;
	cooldownMs: number;
};
export const createCoolDownStore = (cooldownMs: number = 200) => {
	const { subscribe, set, update } = writable<TCooldown>({
		lastTriggerMs: now(),
		cooldownMs: cooldownMs
	});

	const trigger = () => {
		update(({ cooldownMs }) => {
			return {
				lastTriggerMs: now(),
				cooldownMs
			};
		});
	};

	const inactiveAt = (lastTriggerMs: number, cooldownMs: number) => {
		return lastTriggerMs + cooldownMs;
	};

	const isActive = () => {
		let active = false;
		subscribe(({ lastTriggerMs, cooldownMs }) => {
			active = now() - lastTriggerMs < cooldownMs;
		});
		return active;
	};

	const timeLeft = () => {
		let timeLeftMs = 0;
		subscribe(
			({ lastTriggerMs, cooldownMs }) =>
				(timeLeftMs = inactiveAt(lastTriggerMs, cooldownMs) - now())
		);
		return Math.abs(timeLeftMs);
	};

	return {
		subscribe,
		set,
		update,
		trigger,
		isActive,
		timeLeft
	};
};

export const cooldownStore = createCoolDownStore(500);
