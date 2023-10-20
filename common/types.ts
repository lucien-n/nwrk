type Base = {
  reqId: string;
};

type BaseType = {
  type: "command" | "sync" | "auth";
};

export type Request = {
  who: "client" | "turtle";
  whoId: unknown;
  content: unknown;
} & Base;

export type Response<T> = {
  type: "command" | "sync" | "auth";
  success: boolean;
  result?: T | unknown;
} & Base;

export type ServerToClient = {
  content?: unknown;
} & Base &
  BaseType;

export type TurtleToServer = {
  success: boolean;
  result?: unknown;
} & Base;
