import { postErrorToDiscord } from "@/lib/discord"
import { getProductsAndServicesByHandleItself } from "@/lib/lens-api"
import { getSavedProfileByHandle } from "@/lib/postgres"
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

      const productsAndServices = await getProductsAndServicesByHandleItself(
        handle
      )

      return NextResponse.json({ success: true, data: { productsAndServices } })
    } else {
      console.log(" 🔥 🔥 🔥 🔥 🔥  handle !== fromHandle SON DIFERENTES")

      const profile = await getSavedProfileByHandle(handle)
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

      // sleep for 10 seconds:
      // await new Promise((resolve) => setTimeout(resolve, 10000))

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
