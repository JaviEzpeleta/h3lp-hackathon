import { getRecentProducts } from "@/lib/postgres"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const recentProducts = await getRecentProducts()

    return NextResponse.json({ success: true, data: recentProducts })
  } catch (error) {
    console.error("🔴 Error in /api/products/recent:", error)
    return NextResponse.json(
      { error: "Failed to fetch the recent products" },
      { status: 500 }
    )
  }
}
