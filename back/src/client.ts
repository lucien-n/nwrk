import { WebSocket } from "ws";

export class Client {
  ws: WebSocket;
  controlling?: number;

  constructor(ws: WebSocket) {
    this.ws = ws;
  }
}
