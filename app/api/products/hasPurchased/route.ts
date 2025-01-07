import { checkIfUserHasPurchasedProduct } from "@/lib/postgres"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("HELLO 🐔 ")

  try {
    const { productId, address } = await request.json()

    const hasPurchased = await checkIfUserHasPurchasedProduct(
      productId,
      address
    )
    console.log(" 💛 💛 💛 💛 hasPurchased", hasPurchased)

    return NextResponse.json({ data: hasPurchased })
  } catch (error) {
    console.error("🔴 Error in /api/products/hasPurchased:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
