import { postErrorToDiscord } from "@/lib/discord"
import {
  getLensProfileByAddress,
  getProductById,
  saveProductPurchase,
} from "@/lib/postgres"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { productId, userAddress, txHash } = await request.json()

    console.log(" 📁  productId", productId)
    console.log(" 📁  userAddress", userAddress)
    console.log(" 📁  txHash", txHash)

    const product = await getProductById(productId)

    if (!product) {
      await postErrorToDiscord(
        "Product not found in `/api/products/buy` WTF!! :: " + productId
      )
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const productPurchaseToSave = {
      product_id: productId,
      address: userAddress,
      amount: product.price,
      purchase_tx_hash: txHash,
      status: "pending",
    }

    await saveProductPurchase(productPurchaseToSave)

    return NextResponse.json({ data: true })
  } catch (error) {
    console.error("🔴 Error in /api/product/buy:", error)
    return NextResponse.json(
      { error: "Failed to save the purchase" },
      { status: 500 }
    )
  }
}
