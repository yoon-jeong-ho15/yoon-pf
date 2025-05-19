import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("connect");

  console.log(userId);

  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send an initial message
      controller.enqueue(
        new TextEncoder().encode(
          `data: {"message": "Connected for user ${userId}"}\n\n`
        )
      );

      // Setup interval for sending periodic updates (optional)
      const interval = setInterval(() => {
        controller.enqueue(
          new TextEncoder().encode(
            `data: {"timestamp": "${new Date().toISOString()}"}\n\n`
          )
        );
      }, 5000);

      // Cleanup function
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
      });

      // Here you would also set up your actual notification logic
      // e.g., subscribing to a Supabase channel or other data source
    },
  });

  return new NextResponse(stream, { headers });
}
