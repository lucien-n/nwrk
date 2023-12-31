import { WebSocket, WebSocketServer } from "ws";
import { logger as log } from "./logger";
import { Turtle } from "./turtle";
import { Client } from "./client";
import { World } from "./world";
import { Block } from "./types";
import express from "express";
import expressWs from "express-ws";

const port: number = 8080;

const app = express();
const wss = expressWs(app).app;

const world = new World();
const turtles: Turtle[] = [];
let client: Client | null = null;

app.get("/ids", (req, res) => {
  const ids = turtles.map(({ id }) => id);
  res.json(ids);
});

wss.ws("/", (ws: WebSocket) => {
  ws.on("message", async (msg: string) => {
    const { id, type, cmd, content, reqId } = parseMessage(msg);

    if (id === "turtle") handleTurtle(ws, type, cmd, content, reqId);
    if (id === "client") handleClient(ws, type, cmd, content, reqId);
  });

  ws.on("close", () => {
    let index = -1;
    const turtle = turtles.find((t, i) => {
      index = i;
      return t.ws === ws;
    });

    if (turtle && index >= 0) {
      sync(null, client, world);
      turtles.splice(index, 1);
      log.info(`Turtle '${turtle.id}' disconnected`);
    }
  });
});

const handleTurtle = (
  ws: WebSocket,
  type: string,
  cmd: string,
  content: any,
  reqId: string
) => {
  if (cmd === "auth") authenticateTurtle(ws, content);
};

const handleClient = async (
  ws: WebSocket,
  type: string,
  cmd: string,
  content: any,
  reqId: string
) => {
  if (cmd === "auth") {
    authenticateClient(ws, content);
    return;
  }
  if (!client) return;

  const controlling = turtles.find(({ id }) => id === client?.controlling);
  if (!controlling) return;

  await controlling.interpret(cmd);
  sync(controlling, client, world);
};

const authenticateTurtle = async (ws: WebSocket, content: any) => {
  const { id } = content;
  if (id === null || id === undefined) {
    log.warn(`An unidentified turtle tried to connect`);
    return;
  }

  if (turtles.filter((t) => t.id === id).length > 0) {
    log.warn(`Turtle '${id}' is already authenticated`);
    return;
  }

  let turtle = null;

  const { x, y, z, direction } = content;
  if (x && y && z && direction)
    turtle = await new Turtle(ws, world, id, x, y, z, direction);
  else turtle = await new Turtle(ws, world, id);

  sync(turtle, client, world);

  turtles.push(turtle);
  log.success(`Turtle '${turtle.id}' connected`);
};

const authenticateClient = (
  ws: WebSocket,
  { name, controlling }: { name?: string; controlling?: number }
) => {
  const newClient = new Client(ws, name || "Unnamed");

  newClient.send(
    JSON.stringify({
      type: "auth",
      success: true,
    })
  );

  client = newClient;
  log.success(`Client '${name}' connected`);

  if (!controlling) sync(null, client, world);

  const desiredTurtle = turtles.find(({ id }) => id === controlling);
  if (desiredTurtle) {
    client.controlling = desiredTurtle.id;
    desiredTurtle.setController(client);
  }
  sync(desiredTurtle || null, client, world);
};

const sync = async (
  t: Turtle | null,
  c: Client | null,
  w: World,
  wholeWorld: boolean = false
) => {
  if (!c) return;

  let world: Block[] = [];
  if (wholeWorld) world = await w.getWorld();
  else if (t) world = await w.getWorldAround(t.x, t.y, t.z);

  if (t) await t.refreshData();

  c.send(
    JSON.stringify({
      type: "sync",
      content: {
        turtle: t ? await t.toJSON() : null,
        world,
      },
    })
  );

  log.info("Sent sync to client");
};

const parseMessage = (msg: string) => {
  const data = JSON.parse(msg.toString());
  return data;
};

app.listen(port, () => {
  log.info(`Listenning on port ${port}`);
});
