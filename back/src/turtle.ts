import Slot from "./types/slot";
import { Vector3 } from "./vector";

export class Turtle {
  id: number;
  pos: Vector3;
  inventory: Array<Slot | null>;

  constructor(id: number, pos: Vector3) {
    this.id = id;
    this.pos = pos;
    this.inventory = [];
  }
}
