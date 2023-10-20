export type SocketResponse = {
	reqId: string;
	type: 'auth' | 'sync' | 'response';
	cmd?: string;
	success?: boolean;
	result?: unknown;
	content?: unknown;
};

export type Block = {
	x: number;
	y: number;
	z: number;
	name: string;
};

export type Slot = {
	name: string;
	count: number;
};

export type Turtle = {
	id: number;
	x: number;
	y: number;
	z: number;
	direction: number;
	fuelLevel: number;
	inventory: Slot[];
};
