import { WebSocketServer } from "ws";
import { logger as log } from "./logger";

const port: number = 8080;

const wss = new WebSocketServer(
  {
    port,
  },
  () => {
    log.info(`Listenning on port ${port}`);
  }
);
