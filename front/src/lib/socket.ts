export type Socket = {
  send: (cmd: string) => void;
  ws: WebSocket;
};

export const initSocket = (
  url: string,
  onopen: (ev: Event) => any,
  onclose: (ev: CloseEvent) => any,
  on: (event: MessageEvent<any>) => void
): Socket => {
  const ws = new WebSocket(url);

  ws.onopen = (ev: Event) => {
    onopen(ev);
    ws.addEventListener("message", on);
  };

  ws.onclose = (ev) => {
    onclose(ev);
    ws.removeEventListener("message", on);
  };

  return {
    send: (cmd: string) => ws.send(cmd),
    ws,
  };
};
