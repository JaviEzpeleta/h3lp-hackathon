import { NextResponse } from "next/server"
import { getRandomProduct } from "@/lib/prompts"

export async function POST(request: Request) {
  try {
    const randomProduct = await getRandomProduct()
    return NextResponse.json({ success: true, data: randomProduct })
  } catch (error) {
    console.error("🔴 Error in /api/get-bonsai-price:", error)
    return NextResponse.json(
      { error: "Failed to fetch data from BigQuery" },
      { status: 500 }
    )
  }
}
