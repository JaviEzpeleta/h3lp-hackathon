import { getLensProfileByAddress, getProductById } from "@/lib/postgres"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("HELLO 🐔 ")

  try {
    const { productId } = await request.json()

    console.log("the productId is", productId)

    const product = await getProductById(productId)

    console.log("product", product)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const productCreator = await getLensProfileByAddress(product.created_by)

    console.log("productCreator", productCreator)

    if (!productCreator) {
      return NextResponse.json(
        { error: "Product creator not found" },
        { status: 404 }
      )
    }

    product.creator = productCreator

    return NextResponse.json({ data: product })
  } catch (error) {
    console.error("🔴 Error in /api/product/get:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
