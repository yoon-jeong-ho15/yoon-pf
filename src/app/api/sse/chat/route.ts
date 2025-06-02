import { connectedClients, chatEmitter } from "@/lib/chat-events";
import { NextRequest, NextResponse } from "next/server";
import { fetchChatsByChatroomId, insertChat } from "@/lib/data";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const chatroom = url.searchParams.get("ch")!;
  const username = url.searchParams.get("u")!;

  const stream = new ReadableStream({
    start(controller) {
      const sendMessage = (data: Record<string, unknown>) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(new TextEncoder().encode(message));
      };

      sendMessage({
        type: "connected",
        data: { message: "Connected to chatroom : ", chatroom },
      });

      fetchChatsByChatroomId(chatroom)
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
        chatroom,
        sendMessage,
      });

      // console.log(connectedClients);

      const messageHandler = (eventData: Record<string, unknown>) => {
        const { chatroom: targetRoom, message } = eventData;

        if (targetRoom === chatroom) {
          sendMessage({ type: "new-message", data: message });
        }
      };

      chatEmitter.on("new-message", messageHandler);

      request.signal.addEventListener("abort", () => {
        connectedClients.delete(username);
        chatEmitter.off("new-message", messageHandler);
        controller.close();
        // console.log(connectedClients);
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const chatroom = formData.get("chatroom");

    console.log(formData);
    const newMessage = await insertChat(formData);

    chatEmitter.emit("new-message", {
      chatroom: chatroom,
      message: newMessage,
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error sending message", error);
    return NextResponse.json({ status: 500 });
  }
}
