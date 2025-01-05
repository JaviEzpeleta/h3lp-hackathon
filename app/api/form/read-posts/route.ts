import { NextResponse } from "next/server"
import {
  getMultiplePublicationsByProfileId,
  getProfileByHandle,
} from "@/lib/lens-api"
import { generateProductsAndServices } from "@/lib/prompts"

export async function POST(request: Request) {
  const { handle } = await request.json()
  const profile = await getProfileByHandle(handle)
  // const publications = await getMultiplePublicationsByProfileId(profile.id)

  console.log(" 📁  profile:", profile, "handle:", handle)
  // console.log(" 📁  publications:", publications.length)

  // const first50Publications = publications.slice(0, 50)

  // const productsAndServices = await generateProductsAndServices(
  //   first50Publications
  // )

  // console.log(" 📁  productsAndServices:", productsAndServices)

  // let index = 0
  // for (const publication of publications) {
  //   console.log(`${index} --- ${publication.metadata.content}`)
  //   index++
  // }

  // console.log(" 📁  publications:", publications[0])

  return NextResponse.json({ success: true, data: { profile } })
}
