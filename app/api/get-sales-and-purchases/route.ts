import { postErrorToDiscord } from "@/lib/discord"
import {
  getPurchasesByAddress,
  getSalesByAddress,
  getSavedProfileByHandle,
} from "@/lib/postgres"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { handle } = await request.json()

    const profile = await getSavedProfileByHandle(handle)

    if (!profile) {
      await postErrorToDiscord("No profile found for handle: " + handle)
      return NextResponse.json(
        { error: "No profile found for handle: " + handle },
        { status: 404 }
      )
    }
    console.log(
      " 💛 💛 💛 💛 💛  gonna fetch sales and purchases for handle:",
      handle
    )
    const purchases = await getPurchasesByAddress(profile.address)
    const sales = await getSalesByAddress(profile.address)

    return NextResponse.json({ success: true, data: { purchases, sales } })
  } catch (error) {
    console.error("🔴 Error in /api/get-sales-and-purchases:", error)
    return NextResponse.json(
      { error: "Failed to fetch sales and purchases" },
      { status: 500 }
    )
  }
}
