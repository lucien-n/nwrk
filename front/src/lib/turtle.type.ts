import type { TSlot } from "./slot.type";

export type TTurtle = {
  id: string;
  x: number;
  y: number;
  z: number;
  direction: number;
  fuelLevel: number;
  inventory: TSlot[];
};
