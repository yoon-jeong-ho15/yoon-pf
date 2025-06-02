import { connectedClients, chatEmitter } from "@/lib/chat-events";
import { NextRequest, NextResponse } from "next/server";
import { fetchChatsByChatroomId } from "@/lib/data";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const chatroomId = url.searchParams.get("ch")!;
  const username = url.searchParams.get("u")!;

  console.log("ch : ", chatroomId);
  console.log("u : ", username);

  const stream = new ReadableStream({
    start(controller) {
      const sendMessage = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(new TextEncoder().encode(message));
      };

      sendMessage({
        type: "connected",
        data: { message: "Connected to chatroom : ", chatroomId },
      });

      fetchChatsByChatroomId(chatroomId)
        .then((chats) => {
          if (chats) {
            sendMessage({
              type: "previous",
              data: chats,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });

      connectedClients.set(username, {
        controller,
        chatroomId,
        sendMessage,
      });

      const messageHandler = (eventData: any) => {
        const { chatroomId: targetRoom, message } = eventData;

        if (targetRoom === chatroomId) {
          sendMessage({ type: "new-message", data: message });
        }
      };

      chatEmitter.on("new-message", messageHandler);

      request.signal.addEventListener("abort", () => {
        console.log(`Client ${username} disconnected`);
        connectedClients.delete(username);
        chatEmitter.off("new-message", messageHandler);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}

export async function POST(request: NextRequest) {}
