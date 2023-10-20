export type Slot = {
  name: string;
  count: number;
};

export type Block = {
  name: string;
  tagIndexes: number[];
  x: number;
  y: number;
  z: number;
};

export type Position = [x: number, y: number, z: number];

export enum Direction {
  NORTH = 0,
  EAST = 1,
  SOUTH = 2,
  WEST = 3,
}
