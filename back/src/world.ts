import { logger as log } from "./logger";
import { Config, JsonDB } from "node-json-db";

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
    const data = this.get(`/turtle/${id}`);
    return data;
  }
}
