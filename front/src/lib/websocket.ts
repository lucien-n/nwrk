export const initWebsocket = (url: string, onopen: (ev: Event) => unknown, onclose: (ev: CloseEvent) => unknown, onmessage: (ev: MessageEvent) => unknown) => {
  const ws = new WebSocket(url);

  ws.onopen = (ev) => {
    onopen(ev);
    ws.addEventListener("message", onmessage);
  };

  ws.onclose = (ev) => { 
    onclose(ev);
    ws.removeEventListener("message", onmessage);
  };

  return ws
};