import { postErrorToDiscord } from "@/lib/discord"
import { getPurchaseById, updatePurchaseStatus } from "@/lib/postgres"
import { callRefusePurcase } from "@/lib/walletActions"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { purchase_id, address } = await request.json()

    const purchase = await getPurchaseById(purchase_id)

    if (!purchase) {
      console.error("🔴 Purchase not found")
      await postErrorToDiscord(
        "🔴 Purchase not found... " +
          `Sale ID: ${purchase_id}, Address: ${address}`
      )
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    const txHash = await callRefusePurcase({
      productId: purchase.product_id,
      buyerAddress: purchase.address,
    })

    if (!txHash) {
      console.error("🔴 Error in callReleaseFunds")
      await postErrorToDiscord(
        "🔴 Error in api/sale/accept/route.ts -- callReleaseFunds... " +
          `Sale ID: ${purchase_id}, Address: ${address}`
      )
      return NextResponse.json(
        { error: "Error in callReleaseFunds" },
        { status: 500 }
      )
    }

    // update the purchase status
    await updatePurchaseStatus(purchase_id, "regretted")
    return NextResponse.json(
      { success: true, message: "Purchase regretted", txHash },
      { status: 200 }
    )
  } catch (error) {
    console.error("🔴 Error in /api/product/get:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}