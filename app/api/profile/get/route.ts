import { postErrorToDiscord, postToDiscord } from "@/lib/discord"
import { fetchLensProfileByAddress, generateProfileFacts } from "@/lib/lens-api"
import { getLensProfileByAddress, saveLensProfileObject } from "@/lib/postgres"
import { LensSavedProfile, ProfileFetchedFromGraphQL } from "@/lib/types"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { address } = await request.json()

    const profile = await getLensProfileByAddress(address)

    if (!profile) {
      // console.log(
      //   "🐔 🐔 🐔 🐔  No profile found in postgres, fetching from lens api...."
      // )
      const profile = (await fetchLensProfileByAddress(
        address
      )) as ProfileFetchedFromGraphQL
      console.log("🐔 🐔 🐔 🐔  Got profile from lens api:", profile)

      if (!profile) {
        await postErrorToDiscord("profile_not_found for address: " + address)
        return NextResponse.json({ error: "No profile found" }, { status: 404 })
      }

      const profileFacts = await generateProfileFacts(profile)
      if (!profileFacts) {
        await postErrorToDiscord("Error after `generateProfileFacts()`")
        return NextResponse.json(
          { error: "Error after `generateProfileFacts()`" },
          { status: 500 }
        )
      }

      const objetToInsert = {
        id: profile.id,
        address: profile.ownedBy,
        handle: profile.handle,
        display_name: profile.displayName,
        profile_picture: profile.picture,
        cover_picture: profile.coverPicture,
        bio: profile.bio,
        facts: profileFacts,
      } as LensSavedProfile

      await saveLensProfileObject(objetToInsert)

      return NextResponse.json({ success: true, data: objetToInsert })
    } else {
      await postToDiscord(`🐣 Profile already exists: ${profile.handle}`)
      return NextResponse.json({ success: true, data: profile })
    }
  } catch (error) {
    console.error("🔴 Error in /api/product/get:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
