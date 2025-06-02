import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("id");

  console.log("userId : ", userId);

  return new NextResponse();
}
