import { WebSocket, WebSocketServer } from "ws";
import { logger as log } from "./logger";
import { IncomingMessage } from "http";
import { Turtle } from "./turtle";
import { Client } from "./client";
import { World } from "./world";
import { Block } from "./types";

const port: number = 8080;

const wss = new WebSocketServer(
  {
    port,
  },
  () => {
    log.info(`Listenning on port ${port}`);
  }
);

const world = new World();
const turtles: Turtle[] = [];
let client: Client | null = null;

wss.on("connection", (ws) => {
  ws.on("message", async (msg: string) => {
    const { id, cmd, content, reqId } = parseMessage(msg);

    if (id === "turtle") handleTurtle(ws, cmd, content, reqId);
    if (id === "client") handleClient(ws, cmd, content, reqId);
  });
});

const handleTurtle = (
  ws: WebSocket,
  cmd: string,
  content: any,
  reqId: string
) => {
  if (cmd === "auth") authenticateTurtle(ws, content);
};

const handleClient = (
  ws: WebSocket,
  cmd: string,
  content: any,
  reqId: string
) => {
  if (cmd === "auth") authenticateClient(ws, content);
};

const authenticateTurtle = (ws: WebSocket, content: any) => {
  const { id } = content;
  if (!id) return;

  if (turtles.filter((t) => t.id === id).length > 0) {
    log.warn(`Turtle '${id}' is already authenticated`);
    return;
  }

  let turtle = null;

  const { x, y, z, direction } = content;
  if (x && y && z && direction)
    turtle = new Turtle(ws, world, id, x, y, z, direction);
  else turtle = new Turtle(ws, world, id);

  turtles.push(turtle);
  log.success(`Turtle '${turtle.id}' connected`);
};

const authenticateClient = (ws: WebSocket, content: { name?: string }) => {
  const name = content.name || "Unnamed";
  const client = new Client(ws, name);

  client.send(
    JSON.stringify({
      type: "auth",
      success: true,
    })
  );

  log.success(`Client '${name}' connected`);
  if (turtles.length === 0) return;
  client.controlling = turtles[0].id;

  sync(
    turtles.find(({ id }) => id === client.controlling) || null,
    client,
    world
  );
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

  c.ws.send(
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
