import { postErrorToDiscord } from "@/lib/discord"
import {
  generateProfileFacts,
  getProductsAndServicesByHandleItself,
  getProductsAndServicesFromProfileToProfile,
  getProfileByHandle,
} from "@/lib/lens-api"
import {
  findIdeasFromHandleToHandle,
  getSavedProfileByHandle,
  saveLensProfileObject,
} from "@/lib/postgres"
import { LensSavedProfile, ProfileFetchedFromGraphQL } from "@/lib/types"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { handle: handleParam, targetHandle: targetHandleParam } =
      await request.json()
    let handle = handleParam
    let targetHandle = targetHandleParam

    console.log(" 👀 👀 👀 👀 👀  handle, targetHandle")
    console.log(handle, targetHandle)

    if (!handle || !targetHandle) {
      console.log(" 🔥 🔥 🔥 🔥 🔥  NO handle or targetHandle")
      await postErrorToDiscord("🔥 🔥 🔥 🔥 🔥  NO handle or targetHandle...")
      return NextResponse.json({
        success: false,
        data: { handle, targetHandle },
      })
    }

    handle = handle.toLowerCase().trim()
    targetHandle = targetHandle.toLowerCase().trim()

    if (!handle.startsWith("lens/")) {
      handle = "lens/" + handle
    }

    if (!targetHandle.startsWith("lens/")) {
      targetHandle = "lens/" + targetHandle
    }

    if (handle === targetHandle) {
      console.log(" 🔥 🔥 🔥 🔥 🔥  handle === targetHandle SON IGUALES")

      const savedIdeasFound = await findIdeasFromHandleToHandle(handle, handle)

      if (savedIdeasFound && savedIdeasFound.length > 0) {
        console.log(" 🔥 🔥 🔥 🔥 🔥  FOUND SavedIdeas yay!!!", savedIdeasFound)
        return NextResponse.json({
          success: true,
          data: { handle, targetHandle },
        })
      } else {
        await getProductsAndServicesByHandleItself(handle)
      }

      return NextResponse.json({
        success: true,
        data: { handle, targetHandle },
      })
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
          data: { handle, targetHandle },
        })
      }

      const targetProfile = await getSavedProfileByHandle(targetHandle)
      if (!targetProfile) {
        console.log(" 🔥 🔥 🔥 🔥 🔥  NO targetProfile", targetHandle)
        return NextResponse.json({
          success: false,
          data: { handle, targetHandle },
        })
      }

      console.log(
        " 🔥 🔥 🔥 🔥 🔥  OK tengo el profile y el from profile... TIME TO ROCK!!!!!!!"
      )

      const savedIdeasFound = await findIdeasFromHandleToHandle(
        handle,
        targetHandle
      )

      if (savedIdeasFound && savedIdeasFound.length > 0) {
        // console.log(" 🔥 🔥 🔥 🔥 🔥  FOUND SavedIdeas yay!!!", savedIdeasFound)
        return NextResponse.json({
          success: true,
          data: { handle, targetHandle },
        })
      } else {
        console.log("THIS IS THE MOMENT...")
        await getProductsAndServicesFromProfileToProfile(profile, targetProfile)
        console.log("THIS IS THE MOMENT... (ended)")
      }

      return NextResponse.json({
        success: true,
        data: { handle, targetHandle },
      })
    }
  } catch (error) {
    console.error("🔴 Error in /api/product/get:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
