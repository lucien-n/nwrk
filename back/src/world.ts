import { logger as log } from "./logger";
import { Config, JsonDB } from "node-json-db";
import { Block } from "./types";

export class World {
  db: JsonDB;

  constructor() {
    this.db = new JsonDB(new Config("world.json", true, false, "/"));
  }

  async get(path: string, ignoreError = true) {
    let data = null;
    try {
      data = await this.db.getData(path);
    } catch (e) {
      if (!ignoreError) log.error(`Error while getting ${path}`, e);
    }
    return data;
  }

  async getTurtle(id: number) {
    return await this.get(`/turtle/${id}`);
  }

  async getWorld() {
    return await this.get("/block/");
  }

  async getBlock(x: number, y: number, z: number) {
    const blockData = await this.get(`/block/${x}:${y}:${z}`);
    if (!blockData) return null;
    return {
      x,
      y,
      z,
      ...blockData,
    };
  }

  async getWorldAround(x: number, y: number, z: number) {
    const blocks: Block[] = [];

    const directions = [
      { dx: -1, dy: 0, dz: 0 }, // West
      { dx: 1, dy: 0, dz: 0 }, // East
      { dx: 0, dy: 0, dz: -1 }, // North
      { dx: 0, dy: 0, dz: 1 }, // South
      { dx: 0, dy: 1, dz: 0 }, // Up
      { dx: 0, dy: -1, dz: 0 }, // Down
    ];

    for (const dir of directions) {
      const { dx, dy, dz } = dir;
      const block = await this.getBlock(x + dx, y + dy, z + dz);
      if (block) blocks.push(block);
    }

    return blocks;
  }
}
