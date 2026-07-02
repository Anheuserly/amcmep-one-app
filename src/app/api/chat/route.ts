import { NextRequest, NextResponse } from "next/server";

const mockSessions = [
  { $id: "1", participantIds: ["user1", "biz1"], participantNames: ["You", "Shree Ganesh Enterprises"], lastMessage: "We will arrive at 10 AM tomorrow", unreadCount: 2 },
  { $id: "2", participantIds: ["user1", "user2"], participantNames: ["You", "Rahul Kumar"], lastMessage: "Thanks for the update", unreadCount: 0 },
];

const mockMessages: Record<string, any[]> = {
  "1": [{ $id: "m1", sessionId: "1", senderId: "biz1", senderName: "Shree Ganesh Enterprises", type: "text", content: "Hi, we received your request", createdAt: "2024-03-20T10:00:00Z" }],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (sessionId) {
    const messages = mockMessages[sessionId] || [];
    return NextResponse.json({ success: true, messages });
  }

  return NextResponse.json({ success: true, sessions: mockSessions });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, content, type = "text" } = body;

    if (!sessionId || !content) {
      return NextResponse.json({ success: false, error: "Missing sessionId or content" }, { status: 400 });
    }

    const message = {
      $id: `msg-${Date.now()}`,
      sessionId,
      senderId: "user1",
      senderName: "You",
      type,
      content,
      createdAt: new Date().toISOString(),
    };

    if (!mockMessages[sessionId]) mockMessages[sessionId] = [];
    mockMessages[sessionId].push(message);

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Invalid request" }, { status: 400 });
  }
}
