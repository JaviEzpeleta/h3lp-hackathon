import { getSavedProfileByHandle } from "@/lib/postgres"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { handle, fromHandle } = await request.json()

    console.log(" 👀 👀 👀 👀 👀  handle, fromHandle")
    console.log(handle, fromHandle)

    const profile = await getSavedProfileByHandle(handle)
    if (!profile) {
      return NextResponse.json({ success: false, data: { handle, fromHandle } })
    }

    const fromProfile = await getSavedProfileByHandle(fromHandle)
    if (!fromProfile) {
      return NextResponse.json({ success: false, data: { handle, fromHandle } })
    }

    return NextResponse.json({ success: true, data: { handle, fromHandle } })
  } catch (error) {
    console.error("🔴 Error in /api/product/get:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
