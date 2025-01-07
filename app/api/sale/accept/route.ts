import { postErrorToDiscord } from "@/lib/discord"
import { getPurchaseById, updatePurchaseStatus } from "@/lib/postgres"
import { callReleaseFunds } from "@/lib/walletActions"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { sale_id, address } = await request.json()

    const purchase = await getPurchaseById(sale_id)

    if (!purchase) {
      console.error("🔴 Purchase not found")
      await postErrorToDiscord(
        "🔴 Purchase not found... " + `Sale ID: ${sale_id}, Address: ${address}`
      )
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    const txHash = await callReleaseFunds({
      productId: purchase.product_id,
      address: purchase.address,
    })

    if (!txHash) {
      console.error("🔴 Error in callReleaseFunds")
      await postErrorToDiscord(
        "🔴 Error in api/sale/accept/route.ts -- callReleaseFunds... " +
          `Sale ID: ${sale_id}, Address: ${address}`
      )
      return NextResponse.json(
        { error: "Error in callReleaseFunds" },
        { status: 500 }
      )
    }

    // update the purchase status
    await updatePurchaseStatus(sale_id, "accepted")

    return NextResponse.json(
      { success: true, message: "Purchase accepted", txHash },
      { status: 200 }
    )
  } catch (error) {
    console.error("🔴 Error in /api/sale/accept:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
