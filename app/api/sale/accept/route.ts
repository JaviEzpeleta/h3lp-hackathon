import { postErrorToDiscord, postToDiscord } from "@/lib/discord"
import { fetchLensProfileByAddress, generateProfileFacts } from "@/lib/lens-api"
import { getLensProfileByAddress, saveLensProfileObject } from "@/lib/postgres"
import { LensSavedProfile, ProfileFetchedFromGraphQL } from "@/lib/types"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { sale_id, address } = await request.json()

    // TODO: verify the sale was made to this address
  } catch (error) {
    console.error("🔴 Error in /api/product/get:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
