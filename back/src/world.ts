import { Config, JsonDB } from "node-json-db";

export class World {
  db: JsonDB;

  constructor() {
    this.db = new JsonDB(new Config("world.json", true, false, "/"));
  }
}
