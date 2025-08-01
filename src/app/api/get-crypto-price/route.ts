import { getDetailedPrice } from "@/lib/getCryptoPrice";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "0", 10) || 5;
  const priceList = (await getDetailedPrice()).slice(0, limit);
  if (!priceList) {
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 },
    );
  }
  return NextResponse.json(priceList, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    },
  });
}
