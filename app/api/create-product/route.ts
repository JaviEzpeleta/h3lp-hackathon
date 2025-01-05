import { createProduct, updateProductTxHashById } from "@/lib/postgres"
import { addProduct } from "@/lib/walletActions"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const {
      name,
      description,
      price,
      deadline,
      created_by: address,
    } = await request.json()

    console.log("🐔  Got product:", {
      name,
      description,
      price,
      deadline,
      address,
    })

    // return false

    const productId = await createProduct({
      name,
      description,
      price,
      deadline,
      address,
    })

    if (!productId) {
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      )
    }

    console.log("🐔  Created product:", productId)

    const txHash = await addProduct({
      productId: productId.toString(),
      price: price.toString(),
      creator: address,
    })
    if (!txHash) {
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      )
    }

    await updateProductTxHashById({
      id: productId.toString(),
      txHash,
    })

    return NextResponse.json({ success: true, data: productId })
  } catch (error) {
    console.error("🔴 Error in /api/create-product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
