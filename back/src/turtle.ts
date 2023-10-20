import { CommandResponse, Direction, Position, Slot } from "./types";
import { logger as log } from "./logger";
import { World } from "./world";
import { MessageEvent, WebSocket } from "ws";
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

  send(message: string) {
    this.ws.send(message);
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

  async move(move: "up" | "down" | "front" | "back") {
    if (move === "up") {
      const success = await this.exec<boolean>("turtle.up()");
      if (!success) return;

      this.y++;
    } else if (move === "down") {
      const success = await this.exec<boolean>("turtle.down()");
      if (!success) return;

      this.y--;
    } else if (move === "front") {
      const success = await this.exec<boolean>("turtle.front()");
      if (!success) return;

      if (this.direction === Direction.NORTH) this.z--;
      else if (this.direction === Direction.EAST) this.x++;
      else if (this.direction === Direction.SOUTH) this.z++;
      else if (this.direction === Direction.WEST) this.x--;
    } else if (move === "back") {
      const success = await this.exec<boolean>("turtle.back()");
      if (!success) return;

      if (this.direction === Direction.NORTH) this.z++;
      else if (this.direction === Direction.EAST) this.x--;
      else if (this.direction === Direction.SOUTH) this.z--;
      else if (this.direction === Direction.WEST) this.x++;
    }
  }

  async turn(direction: "left" | "right") {
    if (direction === "left") {
      const success = await this.exec<boolean>("turtle.turnLeft()");
      if (!success) return;

      this.direction--;
      this.direction += 4;
      this.direction %= 4;
    } else if (direction === "right") {
      const success = await this.exec<boolean>("turtle.turnLeft()");
      if (!success) return;

      this.direction++;
      this.direction %= 4;
    }
  }

  interpret(msg: string) {
    const [cmd, ...args] = msg.split(":");

    switch (cmd) {
      case "move":
        if (!["up", "down", "forward", "back"].includes(args[0])) return;
        this.move(args[0] as any);
        break;
      case "turn":
        if (!["left", "right"].includes(args[0])) return;
        this.turn(args[0] as any);
        break;
    }
  }

  async exec<T>(cmd: string, reqId?: string): Promise<CommandResponse<T>> {
    if (!reqId) reqId = generateId(); // * client didn't send the command but server did

    this.ws.send(JSON.stringify({ type: "eval", function: cmd, reqId }));
    log.info(`Sent '${reqId}'`);

    return new Promise<CommandResponse<T>>((resolve) => {
      // ? Set command timeout
      setTimeout(() => resolve({ success: false }), 10_000);

      // ? Wait for turtle's response
      this.ws.onmessage = ({ data: msg }: MessageEvent) => {
        if (!msg) return;
        const data = JSON.parse(msg.toString());

        if (data.type !== "response" || data.reqId !== reqId) return;

        resolve({ success: data.success, result: data.result as T, reqId });

        log.success(`Received '${reqId}'`);
      };
    });
  }
}
