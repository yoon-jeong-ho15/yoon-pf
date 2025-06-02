import { EventEmitter } from "stream";

export const connectedClients = new Map<
  String,
  {
    controller: ReadableStreamDefaultController;
    chatroomId: string;
    sendMessage: (data: any) => void;
  }
>();

export const chatEmitter = new EventEmitter();
