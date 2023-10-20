import { WebSocket } from "ws";

export class Client {
  ws: WebSocket;
  name: string;
  controlling: number = 0;

  constructor(ws: WebSocket, name: string) {
    this.ws = ws;
    this.name = name;
  }

  send(message: string) {
    this.ws.send(message);
  }
}
