export const initWebsocket = (url: string, onopen: (ev: Event) => unknown, onclose: (ev: CloseEvent) => unknown, onmessage: (ev: MessageEvent<unknown>) => unknown) => {
  const ws = new WebSocket(url);

  ws.onopen = (ev) => { onopen(ev); };
  ws.onclose = onclose;
  ws.onmessage = onmessage;
};