import { postErrorToDiscord } from "@/lib/discord"
import {
  fetchLensProfileByAddress,
  generateProfileFacts,
  getProductsAndServicesByHandleItself,
  getProfileByHandle,
} from "@/lib/lens-api"
import {
  findIdeasByFromHandleToHandle,
  getSavedProfileByHandle,
  saveLensProfileObject,
} from "@/lib/postgres"
import { LensSavedProfile, ProfileFetchedFromGraphQL } from "@/lib/types"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { handle: handleParam, fromHandle: fromHandleParam } =
      await request.json()
    let handle = handleParam
    let fromHandle = fromHandleParam

    console.log(" 👀 👀 👀 👀 👀  handle, fromHandle")
    console.log(handle, fromHandle)

    if (!handle || !fromHandle) {
      console.log(" 🔥 🔥 🔥 🔥 🔥  NO handle or fromHandle")
      await postErrorToDiscord("🔥 🔥 🔥 🔥 🔥  NO handle or fromHandle...")
      return NextResponse.json({ success: false, data: { handle, fromHandle } })
    }

    handle = handle.toLowerCase().trim()
    fromHandle = fromHandle.toLowerCase().trim()

    if (!handle.startsWith("lens/")) {
      handle = "lens/" + handle
    }

    if (!fromHandle.startsWith("lens/")) {
      fromHandle = "lens/" + fromHandle
    }

    if (handle === fromHandle) {
      console.log(" 🔥 🔥 🔥 🔥 🔥  handle === fromHandle SON IGUALES")

      const findSavedIdeas = await findIdeasByFromHandleToHandle(handle, handle)

      if (findSavedIdeas && findSavedIdeas.length > 0) {
        console.log(" 🔥 🔥 🔥 🔥 🔥  FOUND SavedIdeas yay!!!", findSavedIdeas)
        return NextResponse.json({
          success: true,
          data: { handle, fromHandle },
        })
      } else {
        await getProductsAndServicesByHandleItself(handle)
      }

      return NextResponse.json({ success: true, data: { handle, fromHandle } })
    } else {
      console.log(" 🔥 🔥 🔥 🔥 🔥  handle !== fromHandle SON DIFERENTES")

      let profile = await getSavedProfileByHandle(handle)
      if (!profile) {
        // ! start creating profile entry

        const profileFetched = (await getProfileByHandle(
          handle
        )) as ProfileFetchedFromGraphQL
        console.log("🐔 🐔 🐔 🐔  Got profile from lens api:", profileFetched)

        if (!profileFetched) {
          await postErrorToDiscord("profile_not_found for handle: " + handle)
          return NextResponse.json(
            { error: "No profile found" },
            { status: 404 }
          )
        }

        const profileFacts = await generateProfileFacts(profileFetched)
        if (!profileFacts) {
          await postErrorToDiscord("Error after `generateProfileFacts()`")
          return NextResponse.json(
            { error: "Error after `generateProfileFacts()`" },
            { status: 500 }
          )
        }

        const objetToInsert = {
          id: profileFetched.id,
          address: profileFetched.ownedBy,
          handle: profileFetched.handle,
          display_name: profileFetched.displayName,
          profile_picture: profileFetched.picture,
          cover_picture: profileFetched.coverPicture,
          bio: profileFetched.bio,
          facts: profileFacts,
        } as LensSavedProfile

        await saveLensProfileObject(objetToInsert)

        profile = objetToInsert
        // ! end creating profile entry
      }

      if (!profile) {
        console.log(" 🔥 🔥 🔥 🔥 🔥  NO profile", handle)
        return NextResponse.json({
          success: false,
          data: { handle, fromHandle },
        })
      }

      const fromProfile = await getSavedProfileByHandle(fromHandle)
      if (!fromProfile) {
        console.log(" 🔥 🔥 🔥 🔥 🔥  NO fromProfile", fromHandle)
        return NextResponse.json({
          success: false,
          data: { handle, fromHandle },
        })
      }

      console.log(
        " 🔥 🔥 🔥 🔥 🔥  OK tengo el profile y el from profile... TIME TO ROCK!!!!!!!"
      )

      return NextResponse.json({ success: true, data: { handle, fromHandle } })
    }
  } catch (error) {
    console.error("🔴 Error in /api/product/get:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
