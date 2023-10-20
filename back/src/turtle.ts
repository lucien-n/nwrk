import { Direction, Position, Slot } from "./types";
import { logger as log } from "./logger";
import { World } from "./world";
import { MessageEvent, WebSocket } from "ws";
import { Response } from "../../common/types";
import { generateId } from "./helper";

export class Turtle {
  ws: WebSocket;
  world: World;
  id: number;
  x: number;
  y: number;
  z: number;
  direction: Direction;
  fuelLevel: number = 0;
  inventory: (Slot | null)[] = [];

  constructor(
    ws: WebSocket,
    world: World,
    id: number,
    x?: number,
    y?: number,
    z?: number,
    direction?: number
  ) {
    this.ws = ws;
    this.world = world;

    this.id = id;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.direction = direction || 0;

    // @ts-ignore
    return Promise.resolve(this.loadFromDB()).then(() => this);
  }

  async loadFromDB() {
    const turtle = await this.world.getTurtle(this.id);
    if (!turtle) {
      log.warn(`Turtle not found '${this.id}' in db`);
      return;
    }

    const { x, y, z, direction } = turtle;
    this.x = x;
    this.y = y;
    this.z = z;
    this.direction = direction;

    log.success(`Turtle loaded '${this.id}' from db`);
  }

  async toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      z: this.z,
      direction: this.direction,
      fuelLevel: this.fuelLevel,
    };
  }

  getPosition(direction: "up" | "front" | "down"): Position {
    switch (direction) {
      case "up":
        return [this.x, this.y + 1, this.z];
      case "front":
        const pos: Position = [this.x, this.y, this.z];
        switch (this.direction) {
          case Direction.NORTH:
            pos[2]--;
            break;
          case Direction.EAST:
            pos[0]++;
            break;
          case Direction.SOUTH:
            pos[2]++;
            break;
          case Direction.WEST:
            pos[0]--;
            break;
        }
        return pos;
      case "down":
        return [this.x, this.y - 1, this.z];
    }
  }

  async move(move: "up" | "down" | "front" | "back") {}

  async exec<T>(cmd: string, reqId?: string): Promise<Response<T>> {
    if (!reqId) reqId = generateId(); // * client didn't send the command but server did

    this.ws.send(JSON.stringify({ type: "eval", function: cmd, reqId }));

    let promise = new Promise<Response<T>>((resolve) => {
      this.ws.onmessage = ({ data: msg }: MessageEvent) => {
        if (!msg) return;
        const data = JSON.parse(msg.toString());

        if (data.type === "response" && data.reqId === reqId) {
          log.success(`Received '${reqId}' ${cmd.replace("turtle.", "")}`);
          resolve({ success: data.success, result: data.result as T, reqId });
        }
      };
    });

    return promise;
  }
}
