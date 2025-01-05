import OpenAI from "openai"
import {
  ANTHROPIC_HAIKU_MODEL,
  ANTHROPIC_OPUS_MODEL,
  ANTHROPIC_SONNET_MODEL,
  GPT4o,
  GPT4oB,
  GPT4oMini,
  O1Mini,
  O1Preview,
} from "./constants"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const askGPT = async ({
  messages,
  temperature = 0.33,
  model = GPT4o,
  useCase,
}: {
  useCase: string
  messages: any[]
  temperature?: number
  model?: string
}) => {
  console.log(" 🥠 calling [" + useCase + "]")
  // console.log(" 🥠 messages: ", messages)

  // console.log(" 🥠 calling OpenAI.... (" + model + ") [[" + useCase + "]]")

  try {
    const completion = (await openai.chat.completions.create({
      messages,
      response_format: { type: "json_object" },
      model,
      temperature,
    })) as {
      choices: {
        message: {
          content: string
        }
      }[]
      usage: {
        prompt_tokens: number
        completion_tokens: number
      }
    }

    if (!completion) {
      return false
    }

    // console.log(completion.choices[0])

    console.log(" ✅ OpenAI call finished")

    const theResponse = completion.choices[0].message.content as string

    // console.log(" 🟢 The response is: ", theResponse)

    // const inputTokens = completion.usage.prompt_tokens
    // const outputTokens = completion.usage.completion_tokens

    // if the resoinse starts with ```json
    if (theResponse.startsWith("```json")) {
      return theResponse.replace("```json", "").replace("```", "")
    }

    return theResponse
  } catch (error) {
    console.log(" 🔴 🔴 🔴 🔴 Error asking GPT!! ", error)
    return false
  }
}

export const askGPTNoJSON = async ({
  useCase,

  messages,
  temperature = 0,
  model = GPT4oMini,
}: {
  useCase: string
  messages: any[]
  temperature?: number
  model?: string
}) => {
  console.log(" 🥠 calling OpenAI (no JSON) [[ " + useCase + "]]")
  console.log(" 🥠 messages: ", messages)

  const completion = (await openai.chat.completions.create({
    messages,
    model,
    temperature,
  })) as {
    choices: {
      message: {
        content: string
      }
    }[]
    usage: {
      prompt_tokens: number
      completion_tokens: number
    }
  }

  // console.log(completion.choices[0])

  const theResponse = completion.choices[0].message.content as string

  // const inputTokens = completion.usage.prompt_tokens
  // const outputTokens = completion.usage.completion_tokens

  return theResponse
}

// export const textToSpeech = async (transcript: string) => {
//   const mp3 = await openai.audio.speech.create({
//     model: "tts-1",
//     voice: "onyx",
//     // input: "Today is a wonderful day to build something people love!",
//     input: transcript,
//   })

//   const buffer = Buffer.from(await mp3.arrayBuffer())

//   const newFileName =
//     "inner-peace/audios/" + Math.random().toString(36).substring(2, 14) + ".mp3"

//   const newFileUploaded = await uploadMP3ToS3(buffer, newFileName)

//   console.log(" 🎨 newFileUploaded: ", newFileUploaded)

//   return newFileUploaded
//   // await fs.promises.writeFile(speechFile, buffer)
// }

export const calculateTotalPricing = (
  inputTokens: number,
  outputTokens: number,
  model: string
) => {
  // console.log(" 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡")
  // console.log(" 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡")
  // console.log(" 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡")
  // console.log(" 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡")
  // console.log(" 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡")
  // console.log(" 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡")
  // console.log(inputTokens, outputTokens, model)
  // console.log(" 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡 🟡")

  if (model === ANTHROPIC_SONNET_MODEL) {
    const inputPrice = (inputTokens * 3) / 1000_000
    const outputPrice = (outputTokens * 15) / 1000_000
    return inputPrice + outputPrice
  } else if (model === ANTHROPIC_OPUS_MODEL) {
    const inputPrice = (inputTokens * 15) / 1000_000
    const outputPrice = (outputTokens * 75) / 1000_000
    return inputPrice + outputPrice
  } else if (model === ANTHROPIC_HAIKU_MODEL) {
    const inputPrice = (inputTokens * 0.25) / 1000_000
    const outputPrice = (outputTokens * 1.25) / 1000_000
    return inputPrice + outputPrice
  } else if (model === GPT4oMini) {
    const inputPrice = (inputTokens * 0.15) / 1000_000
    const outputPrice = (outputTokens * 0.6) / 1000_000
    return inputPrice + outputPrice
  } else if (model === GPT4o) {
    const inputPrice = (inputTokens * 5) / 1000_000
    const outputPrice = (outputTokens * 15) / 1000_000
    return inputPrice + outputPrice
  } else if (model === GPT4oB) {
    const inputPrice = (inputTokens * 2.5) / 1000_000
    const outputPrice = (outputTokens * 10) / 1000_000
    return inputPrice + outputPrice
  } else if (model === O1Preview) {
    const inputPrice = (inputTokens * 15) / 1000_000
    const outputPrice = (outputTokens * 60) / 1000_000
    return inputPrice + outputPrice
  } else if (model === O1Mini) {
    const inputPrice = (inputTokens * 3) / 1000_000
    const outputPrice = (outputTokens * 12) / 1000_000
    return inputPrice + outputPrice
  } else {
    // postErrorToDiscord(" no fund pricing for this model : " + model)
    return 0
  }
}
