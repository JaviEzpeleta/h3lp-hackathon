import {
  findIdeasByFromHandleToHandle,
  getSavedProfileByHandle,
} from "@/lib/postgres"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { from: fromHandle, to: toHandle } = await request.json()
    let from = fromHandle
    let to = toHandle

    if (!from.startsWith("lens/")) {
      from = `lens/${from}`
    }
    if (!to.startsWith("lens/")) {
      to = `lens/${to}`
    }

    const ideas = await findIdeasByFromHandleToHandle(from, to)
    if (!ideas) return NextResponse.json({ success: false, data: [] })

    const fromProfile = await getSavedProfileByHandle(from)
    const toProfile = await getSavedProfileByHandle(to)
    return NextResponse.json({
      success: true,
      data: ideas,
      fromProfile,
      toProfile,
    })
  } catch (error) {
    console.error("🔴 Error in /api/ideas/get:", error)
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    )
  }
}
