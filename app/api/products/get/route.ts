import { postErrorToDiscord, postToDiscord } from "@/lib/discord"
import { fetchLensProfileByAddress, generateProfileFacts } from "@/lib/lens-api"
import {
  getLensProfileByAddress,
  getProductById,
  saveLensProfileObject,
} from "@/lib/postgres"
import { LensSavedProfile, ProfileFetchedFromGraphQL } from "@/lib/types"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { productId } = await request.json()

    const product = await getProductById(productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const productCreator = await getLensProfileByAddress(
      product.creator_address
    )

    if (!productCreator) {
      return NextResponse.json(
        { error: "Product creator not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: product })
  } catch (error) {
    console.error("🔴 Error in /api/product/get:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
