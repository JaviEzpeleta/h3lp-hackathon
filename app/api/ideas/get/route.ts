import {
  findIdeasFromHandleToHandle,
  getSavedProfileByHandle,
} from "@/lib/postgres"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { creator: creatorHandle, target: targetHandle } =
      await request.json()
    let creator = creatorHandle
    let target = targetHandle

    if (!creator.startsWith("lens/")) {
      creator = `lens/${creator}`
    }
    if (!target.startsWith("lens/")) {
      target = `lens/${target}`
    }

    const ideas = await findIdeasFromHandleToHandle(creator, target)
    if (!ideas) return NextResponse.json({ success: false, data: [] })

    const creatorProfile = await getSavedProfileByHandle(creator)
    const targetProfile = await getSavedProfileByHandle(target)
    return NextResponse.json({
      success: true,
      data: ideas,
      creatorProfile,
      targetProfile,
    })
  } catch (error) {
    console.error("🔴 Error in /api/ideas/get:", error)
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    )
  }
}
