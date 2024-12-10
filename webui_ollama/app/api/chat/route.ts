import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { message } = await request.json();

  try {
    const response = await fetch(
      `http://localhost:8080/ai/generate?message=${encodeURIComponent(message)}`
    );
    const data = await response.text();
    return NextResponse.json({ response: data });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
