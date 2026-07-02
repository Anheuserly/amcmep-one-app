import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const vertical = searchParams.get("vertical") || "web";

  const mockResults = [
    { id: "1", title: `Result for "${query}" in ${vertical}`, url: "https://amcmep.in", snippet: "This is a sample search result from the AMCMEP platform.", vertical, score: 0.95 },
    { id: "2", title: `Another ${vertical} result`, url: "https://app.amcmep.in", snippet: "Discover services, businesses, and marketplace items.", vertical, score: 0.88 },
    { id: "3", title: `Related ${vertical} content`, url: "https://partner.amcmep.in", snippet: "Partner workspace and business management tools.", vertical, score: 0.82 },
  ];

  return NextResponse.json({
    success: true,
    query,
    vertical,
    results: mockResults,
    total: mockResults.length,
  });
}
