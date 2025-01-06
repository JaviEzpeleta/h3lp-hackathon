import { askGroq } from "@/lib/groq"
import { postToDiscord } from "./discord"
import { askGPT, askGPTNoJSON } from "./openai"
import { askDeepSeek } from "./deepseek"
import { LensSavedProfile, ProfileFetchedFromGraphQL } from "./types"
import { cleanHandle } from "./strings"

export const getRandomProduct = async () => {
  const systemPrompt = `
  You are an expert at generating random product names.
  `

  const userPrompt = `
  Generate a random product name.

  Reply in JSON format, with the following fields:
  {
    "product_name": "..."
    "product_description": "..."
    "product_price": from 5 to 100 // in USD
    "product_deadline": from 1 to 100 // in days
  }

  Do not include any other text or comments. Thanks!
  `

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ]

  // console.log("🔴 GROQ MESSAGES:", messages)
  // console.log("thinking.... 🧠 ")

  const response = await askGroq({
    messages,
  })

  // console.log("🔴 GROQ RESPONSE:", response)

  // parse the response
  const parsedResponse = JSON.parse(response)

  console.log("🔴 PARSED RESPONSE:", parsedResponse)

  return parsedResponse
}

export const generateProductsAndServices = async (publications: any[]) => {
  const systemPrompt = `You are an expert at generating products and services from a list of publications from a profile. Make the best out of this user! Find and list ways this user can serve and help others based on what they say in their publications.`

  const userPrompt = `
  ${publications
    .map(
      (publication) => `

<PUBLICATION>
pubication_id: ${publication.id}: 
content: ${publication.metadata.content}
</PUBLICATION>

`
    )
    .join("\n")}

    ---- Reply in JSON format, with the following fields:
    {
      "products_and_services": [
        {
          "product_name": "...",
          "product_description": "...",
          "product_price": ... // number (in US DOLLARS!). Could go from 5 to 100000
          "payment_type": "...", // can be "one-time" or "recurring (monthly)"
          "product_deadline": from 1 to 100 // in days, measuring how long the creator would need to deliver the product or service, measured in days
          "inspired_by_publication_ids": ["..."] // the publication id(s) that inspired this product or service
        }, 
        ...
      ]
    }
  `

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ]

  // const response = await askGroq({
  //   messages,
  // })

  // const response = await askDeepSeek({
  //   messages,
  // })

  const response = await askGPT({
    messages,
    useCase: "generateProductsAndServices",
  })

  // const response = await askSonnet({
  //   messages,
  //   useCase: "generateProductsAndServices",
  // })

  return response
}

export const generateProductsAndServicesTargetedToProfile = async ({
  publications,
  creatorProfile,
  targetProfile,
}: {
  publications: any[]
  creatorProfile: LensSavedProfile
  targetProfile: LensSavedProfile
}) => {
  const systemPrompt = `You are an expert at generating products and services from a list of publications from a profile.
  
The goal is to find the best talents from the creator profile (${creatorProfile.handle}) that can help the target profile (${targetProfile.handle}).


Make the best out of this encounter of 2 profiles!
Find and list ways ${creatorProfile.handle} can serve and help ${targetProfile.handle} based on what they say in their publications.`

  const userPrompt = `

<TargetProfileContext>
  Context on ${targetProfile.handle}:
  ${JSON.stringify(targetProfile)}
</TargetProfileContext>


Publications from ${creatorProfile.handle}:

  ${publications
    .map(
      (publication) => `

<PUBLICATION>
pubication_id: ${publication.id}: 
content: ${publication.metadata.content}
</PUBLICATION>

`
    )
    .join("\n")}

    ---- Reply in JSON format, with the following fields:
    {
      "products_and_services": [
        {
          "product_name": "...",
          "product_description": "...", // here, describe how this skill from ${cleanHandle(
            creatorProfile.handle
          )} will help ${cleanHandle(targetProfile.handle)}!!
          "product_price": ... // number (in US DOLLARS!). Could go from 5 to 100000
          "payment_type": "...", // can be "one-time" or "recurring (monthly)"
          "product_deadline": from 1 to 100 // in days, measuring how long the creator would need to deliver the product or service, measured in days
          "inspired_by_publication_ids": ["..."] // the publication id(s) that inspired this product or service
        }, 
        ...
      ]
    }
  `

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ]

  // const response = await askGroq({
  //   messages,
  // })

  // const response = await askDeepSeek({
  //   messages,
  // })

  // const response = await askSonnet({
  //   messages,
  //   useCase: "generateProductsAndServices",
  // })

  const response = await askGPT({
    messages,
    useCase: "generateProductsAndServicesTargetedToProfile",
  })

  return response
}

export const generateProfileFactsFromPublications = async ({
  profile,
  publications,
}: {
  profile: ProfileFetchedFromGraphQL
  publications: any[]
}) => {
  const systemPrompt = `You are an expert biographer and psichologist.
You will be given a list of publications from a profile. You will need to generate a list of facts about the profile based on the publications.`

  const userPrompt = `
  ${publications
    .map(
      (publication) => `

# User Name: ${profile.displayName}
# User Handle: ${profile.handle.replace("lens/", "")}
${
  profile.bio && profile.bio.length > 0
    ? "# User Description: " + profile.bio
    : ""
}

<PUBLICATION>
pubication_id: ${publication.id}: 
content: ${publication.metadata.content}
</PUBLICATION>

Return a list of facts about the user based on the publications. As many as you consider relevant, in the same language as the overall publications.


Reply in JSON format, with the following fields:
{
  "facts": ["fact1", "fact2", "fact3"]
}

`
    )
    .join("\n")}
  `

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ]

  const response = await askGPT({
    messages,
    useCase: "generateProfileFactsFromPublications",
  })

  return response
}

export const mergeProfileFacts = async ({
  facts,
  profile,
}: {
  facts: any[]
  profile: ProfileFetchedFromGraphQL
}) => {
  const systemPrompt = `You are an expert at merging a list of facts about a user into a single list of facts. You will be given a list of facts about a user and a profile. You will need to merge the facts into a single list of facts.`

  const userPrompt = `

# User Name: ${profile.displayName}
# User Handle: ${profile.handle.replace("lens/", "")}
${
  profile.bio && profile.bio.length > 0
    ? "# User Description: " + profile.bio
    : ""
}


<CompiledFacts>
${JSON.stringify(facts)}
</CompiledFacts>


Return a single list of facts about the user, in JSON format, in the same language as the initial facts.

The format for the JSON must be:
{
  "facts": ["fact1", "fact2", "fact3"]
}

THANK YOU!
  `

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ]

  const response = await askGPT({
    messages,
    useCase: "mergeProfileFacts",
  })

  return response
}

export const mergeTopProductsAndServices = async ({
  productsAndServices,
  profile,
}: {
  productsAndServices: any[]
  profile: LensSavedProfile
}) => {
  const systemPrompt = `You are an expert at merging a list of products and services from a profile into a single list of products and services. You will be given a list of products and services from a profile and a profile. You will need to merge the products and services into a single list of products and services. Pick the best ones and sort them by relevance (most relevant first).`

  const userPrompt = `

# User Name: ${profile.display_name}
# User Handle: ${profile.handle.replace("lens/", "")}
${
  profile.bio && profile.bio.length > 0
    ? "# User Description: " + profile.bio
    : ""
}
    # Facts about the user: ${JSON.stringify(profile.facts)}


<CompiledProductsAndServices>
${JSON.stringify(productsAndServices)}
</CompiledProductsAndServices>


Return a single list of products and services about the user, in JSON format, in the same language as the initial products and services.

The format for the JSON must be:
{
  "products_and_services": [
    {
      "product_name": "...",
      "product_description": "...",
      "product_price": ..., // number
      "payment_type": "...", // can be "one-time" or "recurring (monthly)"
      "product_deadline": from 1 to 100 // in days
      "inspired_by_publication_ids": ["..."] // the publication id(s)
    }, 
    ...
  ]
}

THANK YOU!
  `

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ]

  const response = await askGPT({
    messages,
    useCase: "mergeProductsAndServicesForIndividualProfile",
  })

  return response
}

export const mergeTopProductsAndServicesTargetedToProfile = async ({
  productsAndServices,
  creatorProfile,
  targetProfile,
}: {
  productsAndServices: any[]
  creatorProfile: LensSavedProfile
  targetProfile: LensSavedProfile
}) => {
  const systemPrompt = `You are an expert at merging a list of products and services into a single list of products and services.
You will be given a list of products and services from a profile (${cleanHandle(
    creatorProfile.handle
  )}) and a profile (${cleanHandle(targetProfile.handle)}).
You have to merge the products and services into a single list of products and services.
Pick the best ones and sort them by relevance (most relevant first).`

  const userPrompt = `

  <ContextOnTheCreatorOfServices>
# User Name: ${creatorProfile.display_name}
# User Handle: ${creatorProfile.handle.replace("lens/", "")}
${
  creatorProfile.bio && creatorProfile.bio.length > 0
    ? "# User Description: " + creatorProfile.bio
    : ""
}
    # Facts about the user: ${JSON.stringify(creatorProfile.facts)}
</ContextOnTheCreatorOfServices>

<ContextOnTheTargetProfile>
# User Name: ${targetProfile.display_name}
# User Handle: ${targetProfile.handle.replace("lens/", "")}
${
  targetProfile.bio && targetProfile.bio.length > 0
    ? "# User Description: " + targetProfile.bio
    : ""
}
    # Facts about the user: ${JSON.stringify(targetProfile.facts)}
</ContextOnTheTargetProfile>


<CompiledProductsAndServices>
${JSON.stringify(productsAndServices)}
</CompiledProductsAndServices>


Return a single list of products and services about the user, in JSON format, in the same language as the initial products and services.

The format for the JSON must be:
{
  "products_and_services": [
    {
      "product_name": "...",
      "product_description": "...",
      "product_price": ..., // number
      "payment_type": "...", // can be "one-time" or "recurring (monthly)"
      "product_deadline": from 1 to 100 // in days
      "inspired_by_publication_ids": ["..."] // the publication id(s)
    }, 
    ...
  ]
}

THANK YOU!
  `

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ]

  const response = await askGPT({
    messages,
    useCase: "mergeTopProductsAndServicesTargetedToProfile",
  })

  return response
}
