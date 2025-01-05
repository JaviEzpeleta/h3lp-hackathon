import Anthropic from "@anthropic-ai/sdk"

import { ANTHROPIC_OPUS_MODEL, ANTHROPIC_SONNET_MODEL } from "./constants"
import { postErrorToDiscord } from "./discord"

export const askSonnet = async ({
  messages,
  temperature = 0,
  model = ANTHROPIC_SONNET_MODEL,

  useCase,
}: {
  useCase: string
  messages: any[]
  temperature?: number
  model?: string
}) => {
  const originalMessages = messages
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  let processedMessages = messages

  const systemMessage = //gonna extract the message that has role = 'system':
    messages.find((message) => message.role === "system")

  if (systemMessage) {
    processedMessages = messages.filter((message) => message.role !== "system")
  }

  try {
    console.log(
      "Asking 🩷  [" + model + "] 🩷 fr fr 🧠🧠... [[ " + useCase + "]]"
    )
    const msg = (await anthropic.messages.create({
      system: systemMessage?.content,
      model,
      max_tokens: 4096,
      messages: processedMessages,
      temperature,
    })) as any

    console.log(" ... ✅ " + model + " finished!")

    // console.log(" 🟣 REturning messageL")
    // console.log(msg)

    // const inputTokens = msg.usage.input_tokens
    // // get the number of output tokens spent:
    // const outputTokens = msg.usage.output_tokens

    // const totalSpent = calculateTotalPricing(inputTokens, outputTokens, model)

    const theResponse = msg.content[0].text

    return theResponse
  } catch (error: any) {
    await postErrorToDiscord(" 🔴 Error in askSonnet: " + error.message)
    console.error(" 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 Error in askSonnet:", error.message)
    return []
  }
}

export const askOpus = async (messages: any[]) => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  let processedMessages = messages

  const systemMessage = //gonna extract the message that has role = 'system':
    messages.find((message) => message.role === "system")

  if (systemMessage) {
    processedMessages = messages.filter((message) => message.role !== "system")
  }

  try {
    console.log("Asking OPUS 🧠... [[ " + "" + "]]")
    const msg = (await anthropic.messages.create({
      system: systemMessage?.content,
      model: ANTHROPIC_OPUS_MODEL,
      max_tokens: 4096,
      messages: processedMessages,
      temperature: 0.5,
    })) as any
    return msg.content[0].text
  } catch (error: any) {
    await postErrorToDiscord(" 🔴 Error in askSonnet: " + error.message)
    console.error(" 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 Error in askSonnet:", error.message)
    return []
  }
}
