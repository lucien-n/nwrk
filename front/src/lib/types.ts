export type SocketResponse = {
  reqId: string;
  type: "auth" | "sync" | "response";
  cmd?: string;
  success?: boolean;
  result?: any;
  content: {
    turtle?: any;
    world?: any;
  };
};