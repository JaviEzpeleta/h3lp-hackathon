import { postErrorToDiscord, postToDiscord } from "@/lib/discord"
import {
  createProduct,
  getSavedProfileByHandle,
  updateProductTxHashById,
} from "@/lib/postgres"
import { addProduct } from "@/lib/walletActions"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const {
      name,
      description,
      price,
      deadline,
      created_by,
      inspired_by_publication_ids,
      offered_by,
      targeted_to,
    } = await request.json()

    // return NextResponse.json({ success: true, done: true })

    // return false

    const productId = await createProduct({
      name,
      description,
      price,
      deadline,
      created_by,
      inspired_by_publication_ids,
      offered_by,
      targeted_to,
    })

    if (!productId) {
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      )
    }

    await postToDiscord(
      "🐔 New product created! " +
        productId +
        " title: " +
        name +
        " by " +
        created_by +
        " for " +
        targeted_to
    )

    console.log("🐔  Created product:", productId)

    // console.log(" JUST GONNA LOOK FOR ", offered_by)

    // return NextResponse.json({ success: true, data: productId })

    const creatorProfile = await getSavedProfileByHandle(offered_by)

    if (!creatorProfile) {
      await postErrorToDiscord(
        "🔴 Error in /api/create-product: Failed to get creator profile by handle WTF!!!  (" +
          offered_by +
          ")"
      )
      return NextResponse.json(
        { error: "Failed to get creator profile" },
        { status: 500 }
      )
    }

    const txHash = await addProduct({
      productId: productId.toString(),
      price: price.toString(),
      creator: creatorProfile.address,
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
