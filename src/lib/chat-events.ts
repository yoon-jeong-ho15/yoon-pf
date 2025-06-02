import { EventEmitter } from "stream";

export const connectedClients = new Map<
  string,
  {
    controller: ReadableStreamDefaultController;
    chatroom: string;
    sendMessage: (data: Record<string, unknown>) => void;
  }
>();

export const chatEmitter = new EventEmitter();
