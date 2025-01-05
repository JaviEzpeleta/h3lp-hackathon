import { NextResponse } from "next/server"
import { getSavedProfileByAddress } from "@/lib/postgres"
import { postErrorToDiscord } from "@/lib/discord"

export async function POST(request: Request) {
  try {
    const { address } = await request.json()
    console.log("🐔  Got address:", address)

    const savedProfile = await getSavedProfileByAddress(address)
    if (!savedProfile) {
      await postErrorToDiscord("No saved profile found for address: " + address)
    }
    console.log("🟢 savedProfile:", savedProfile)

    return NextResponse.json({ success: true, data: savedProfile })
  } catch (error) {
    console.error("🔴 Error in /api/get-profile-by-address:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile by address" },
      { status: 500 }
    )
  }
}
