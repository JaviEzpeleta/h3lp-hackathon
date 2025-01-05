import { NextResponse } from "next/server"
import { getPriceBySymbol } from "@/lib/prices"

export async function POST(request: Request) {
  try {
    const bonsaiPrice = await getPriceBySymbol("BONSAI")
    console.log("🟢 Got bonsai price:", bonsaiPrice)

    return NextResponse.json({ success: true, data: bonsaiPrice })
  } catch (error) {
    console.error("🔴 Error in /api/get-bonsai-price:", error)
    return NextResponse.json(
      { error: "Failed to fetch data from BigQuery" },
      { status: 500 }
    )
  }
}
