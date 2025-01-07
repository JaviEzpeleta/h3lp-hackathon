import { postErrorToDiscord, postToDiscord } from "@/lib/discord"
import { fetchLensProfileByAddress, generateProfileFacts } from "@/lib/lens-api"
import {
  getLensProfileByAddress,
  getPurchaseById,
  saveLensProfileObject,
  updatePurchaseStatus,
} from "@/lib/postgres"
import { LensSavedProfile, ProfileFetchedFromGraphQL } from "@/lib/types"
import { callReleaseFunds } from "@/lib/walletActions"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { sale_id, address } = await request.json()

    // TODO: verify the sale was made to this address

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

    // now we call the smart contract to accept the sale

    //
  } catch (error) {
    console.error("🔴 Error in /api/product/get:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
