import { NextRequest, NextResponse } from "next/server";

const mockRequests = [
  { $id: "1", title: "HVAC Annual Maintenance", status: "in_progress", priority: "high", serviceType: "HVAC", siteAddress: "Office 301, Tech Park, Bangalore", customerId: "user1", estimatedCost: 5000, createdAt: "2024-03-15" },
  { $id: "2", title: "Fire Extinguisher Inspection", status: "open", priority: "urgent", serviceType: "Fire Safety", siteAddress: "Warehouse B, Industrial Area, Bangalore", customerId: "user1", estimatedCost: 3000, createdAt: "2024-03-18" },
];

export async function GET() {
  return NextResponse.json({ success: true, requests: mockRequests, total: mockRequests.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, serviceType, siteAddress, priority } = body;

    if (!title || !serviceType || !siteAddress) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const created = {
      $id: `req-${Date.now()}`,
      title,
      description,
      status: "open",
      priority: priority || "medium",
      serviceType,
      siteAddress,
      customerId: "user1",
      estimatedCost: body.estimatedCost || 0,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, request: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Invalid request" }, { status: 400 });
  }
}
