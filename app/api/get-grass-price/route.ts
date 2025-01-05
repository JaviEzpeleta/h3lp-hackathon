import { NextResponse } from "next/server"
import {
  getGrassPrice,
  getGrassPriceFromPool,
  getPriceBySymbol,
} from "@/lib/prices"

export async function POST(request: Request) {
  try {
    const grassPrice = 2.56
    // const grassPrice = await getGrassPriceFromPool()
    console.log("🟢 Got grass price:", grassPrice)

    return NextResponse.json({ success: true, data: grassPrice })
  } catch (error) {
    console.error("🔴 Error in /api/get-grass-price:", error)
    return NextResponse.json(
      { error: "Failed to fetch data from BigQuery" },
      { status: 500 }
    )
  }
}
