const ENDPOINT = "https://api-v2.lens.dev"

import { profileByHandle } from "@/graphql/profileByHandle"
import {
  MAX_PUBLICATIONS_WHEN_PARSING_PROFILE,
  PROFILE_PAGES_TO_PARSE,
} from "./constants"
import { profileByAddress } from "@/graphql/profileByAddress"
import { postErrorToDiscord } from "./discord"
import { LensSavedProfile, ProfileFetchedFromGraphQL } from "./types"
import {
  generateProductsAndServices,
  generateProductsAndServicesTargetedToProfile,
  generateProfileFactsFromPublications,
  mergeProfileFacts,
  mergeTopProductsAndServices,
  mergeTopProductsAndServicesTargetedToProfile,
} from "./prompts"
import {
  getSavedProfileByHandle,
  saveProductsAndServicesToIdeasTable,
} from "./postgres"

// Define the type for publication items
type Publication = {
  id: string
  createdAt: string
  stats: {
    reactions: number
    comments: number
  }
  metadata: {
    id: string
    content: string
    asset?: {
      image: {
        optimized: {
          uri: string
        }
      }
    }
  }
}

export const getMultiplePublicationsByProfileId = async (
  handle: string,
  pages = PROFILE_PAGES_TO_PARSE
) => {
  const getPaginatedPosts = async (cursor?: string) => {
    const graphqlQuery = {
      query: `
        query PublicationsByHandle {
          publications(request: {
            where: {
              from: "${handle}",
              metadata: {
                mainContentFocus: [TEXT_ONLY, IMAGE]
              }
            },
            ${cursor ? `cursor: "${cursor}"` : ""}
          }) {
            items {
              ... on Post {
                id
                createdAt
                stats {
                  reactions
                  comments
                }
                metadata {
                  ... on ImageMetadataV3 {
                    id
                    content
                    asset {
                      image {
                        optimized {
                          uri
                        }
                      }
                    }
                  }
                  ... on TextOnlyMetadataV3 {
                    id
                    content
                  }
                }
              }
            }
            pageInfo {
              next
            }
          }
        }
      `,
      variables: {},
    }

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphqlQuery),
    })

    return response.json()
  }

  try {
    let allItems: Publication[] = []
    let cursor

    for (let i = 0; i < pages; i++) {
      const data = await getPaginatedPosts(cursor)

      const items = data.data.publications.items
      cursor = data.data.publications.pageInfo.next

      allItems = [...allItems, ...items]

      console.log("items from Page", i, items.length)

      if (!cursor) break
    }

    const filteredItems = allItems.filter((item) => item.id)

    // order by createdAt DESC:
    const sortedItems = filteredItems.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return sortedItems.slice(0, MAX_PUBLICATIONS_WHEN_PARSING_PROFILE)
  } catch (e) {
    console.error("Error fetching multiple publications:", e)
    return []
  }
}

export const getProfileIdByHandle = async (handle: string) => {
  // if handle doesnt start with lens/, add it:
  if (!handle.startsWith("lens/")) {
    handle = `lens/${handle}`
  }
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: profileByHandle, variables: { handle } }),
  })
  const data = await response.json()
  if (data.errors) {
    console.error("🔴 Error in `getProfileIdByHandle()`:", data.errors)
    throw new Error("Failed to fetch profile ID")
  }
  if (!data.data.profile) {
    throw new Error("Failed to fetch profile ID")
  }
  return data.data.profile.id
}

export const getProfileByHandle = async (
  handle: string
): Promise<ProfileFetchedFromGraphQL | false> => {
  // if handle doesnt start with lens/, add it:
  if (!handle.startsWith("lens/")) {
    handle = `lens/${handle}`
  }
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: profileByHandle, variables: { handle } }),
  })
  const data = await response.json()
  if (data.errors) {
    console.error("🔴 Error in `getProfileIdByHandle() [1]`:", data.errors)
    await postErrorToDiscord("Error in `getProfileIdByHandle() [1]`")
    return false
  }
  if (!data.data.profile) {
    console.error("🔴 Error in `getProfileIdByHandle() [2]`:", data.errors)
    await postErrorToDiscord("Error in `getProfileIdByHandle() [2]`")
    return false
  }
  const profile = {
    id: data.data.profile.id,
    handle,
    displayName: data.data.profile.metadata.displayName,
    coverPicture: data.data.profile.metadata.coverPicture?.optimized.uri,
    picture: data.data.profile.metadata.picture?.optimized.uri,
    followers: data.data.profile.stats.followers,
    bio: data.data.profile.metadata.bio,
    ownedBy: data.data.profile.ownedBy.address,
  } as ProfileFetchedFromGraphQL

  return profile
}

export const fetchLensProfileByAddress = async (address: string) => {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: profileByAddress, variables: { address } }),
  })
  const data = await response.json()
  const handle = data.data.profiles.items[0].handle.fullHandle
  return await getProfileByHandle(handle)
}

export const generateProfileFacts = async (
  profile: ProfileFetchedFromGraphQL
): Promise<string[] | false> => {
  const publications = await getMultiplePublicationsByProfileId(profile.id)

  if (!publications) {
    console.error(
      "🔴 Error in `generateProfileFacts() - couldnt get publications`"
    )
    await postErrorToDiscord(
      "🔴 Error in `generateProfileFacts() - couldnt get publications`"
    )
    return false
  }

  const BLOCKS_OF_POSTS = 20
  console.log(" 🐘  VAMOSSSSSSS")
  console.log(publications.length)

  const blocksOfPublications = divideArrayIntoChunks(
    publications,
    BLOCKS_OF_POSTS
  )

  console.log("blocksOfPublications:::", blocksOfPublications.length)

  const factsFromBlocksOfPublications = await Promise.all(
    blocksOfPublications.map(async (block) => {
      const facts = await generateProfileFactsFromPublications({
        profile,
        publications: block,
      })
      return facts
    })
  )

  const facts = await mergeProfileFacts({
    facts: factsFromBlocksOfPublications,
    profile,
  })

  if (!facts) {
    console.error("🔴 Error in `generateProfileFacts() - couldnt merge facts`")
    await postErrorToDiscord(
      "🔴 Error in `generateProfileFacts() - couldnt merge facts`"
    )
    return false
  }
  const factsArray = JSON.parse(facts as string).facts
  console.log("☑️ ", factsArray.length, " facts generated!!")

  return factsArray
}

export const divideArrayIntoChunks = (array: any[], chunkSize: number) => {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

export const getProductsAndServicesByHandleItself = async (handle: string) => {
  const profile = await getSavedProfileByHandle(handle)
  if (!profile) {
    await postErrorToDiscord(
      "🔥 🔥 🔥 🔥 🔥  NO profile found for handle " +
        handle +
        " in `getProductsAndServicesByHandleItself()`"
    )
    return false
  }
  const publications = await getMultiplePublicationsByProfileId(profile.id)

  const BATCHES = 40

  const groupedPublications = divideArrayIntoChunks(publications, BATCHES)

  console.log(" 📁  publications:", publications.length)
  console.log(" 📁  groupedPublications:", groupedPublications.length)
  // const productsAndServices = await generateProductsAndServices(publications)

  const productsAndServicesFromBlocksOfPublications = await Promise.all(
    groupedPublications.map(async (block) => {
      const pAndS = await generateProductsAndServices(block)
      return pAndS
    })
  )

  // console.log(
  //   " 📁  productsAndServicesFromBlocksOfPublications:",
  //   productsAndServicesFromBlocksOfPublications
  // )

  const mergedTopProductsAndServices = await mergeTopProductsAndServices({
    profile,
    productsAndServices: productsAndServicesFromBlocksOfPublications,
  })

  console.log(
    " 📁  mergedTopProductsAndServices:",
    mergedTopProductsAndServices
  )

  if (!mergedTopProductsAndServices) {
    console.error(
      "🔴 Error in `getProductsAndServicesByHandleItself() - couldnt merge products and services`"
    )
    await postErrorToDiscord(
      "🔴 Error in `getProductsAndServicesByHandleItself() - couldnt merge products and services`"
    )
    return false
  }

  // now i want to save in the table of ideas h3lp_ideas

  const productsAndServices = JSON.parse(
    mergedTopProductsAndServices as string
  ).products_and_services

  await saveProductsAndServicesToIdeasTable({
    from: handle,
    to: handle,
    productsAndServices,
  })

  return true
}

export const getProductsAndServicesFromProfileToProfile = async (
  fromProfile: LensSavedProfile,
  toProfile: LensSavedProfile
) => {
  console.log(" 🔥 🔥 🔥 🔥 🔥  findIdeasByFromProfileToProfile()")
  console.log("fromProfile")
  console.log(fromProfile)
  console.log("toProfile")
  console.log(toProfile)
  // return false
  const publications = await getMultiplePublicationsByProfileId(toProfile.id)

  const BATCHES = 35

  const groupedPublications = divideArrayIntoChunks(publications, BATCHES)

  console.log(" 📁  publications:", publications.length)
  console.log(" 📁  groupedPublications:", groupedPublications.length)
  // const productsAndServices = await generateProductsAndServices(publications)

  const productsAndServicesFromBlocksOfPublications = await Promise.all(
    groupedPublications.map(async (block) => {
      const pAndS = await generateProductsAndServicesTargetedToProfile({
        publications: block,
        creatorProfile: toProfile,
        targetProfile: fromProfile,
      })
      return pAndS
    })
  )

  // console.log(
  //   " 📁  productsAndServicesFromBlocksOfPublications:",
  //   productsAndServicesFromBlocksOfPublications
  // )

  const mergedTopProductsAndServices =
    await mergeTopProductsAndServicesTargetedToProfile({
      creatorProfile: toProfile,
      targetProfile: fromProfile,
      productsAndServices: productsAndServicesFromBlocksOfPublications,
    })

  console.log(
    " 📁  mergedTopProductsAndServices:",
    mergedTopProductsAndServices
  )

  if (!mergedTopProductsAndServices) {
    console.error(
      "🔴 Error in `getProductsAndServicesByHandleItself() - couldnt merge products and services`"
    )
    await postErrorToDiscord(
      "🔴 Error in `getProductsAndServicesByHandleItself() - couldnt merge products and services`"
    )
    return false
  }

  // now i want to save in the table of ideas h3lp_ideas

  const productsAndServices = JSON.parse(
    mergedTopProductsAndServices as string
  ).products_and_services

  await saveProductsAndServicesToIdeasTable({
    from: fromProfile.handle,
    to: toProfile.handle,
    productsAndServices,
  })

  return ["pepe"]
}
