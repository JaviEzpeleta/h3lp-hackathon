import { GROQ_MODEL } from "@/lib/constants"
import { postErrorToDiscord } from "@/lib/discord"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" })

export const askGroq = async ({
  messages,
  model = GROQ_MODEL,
}: {
  messages: any[]
  model?: string
}) => {
  try {
    const response = await groq.chat.completions.create({
      messages,
      model,
    })
    return response.choices[0].message.content as string
  } catch (error) {
    await postErrorToDiscord(
      "🔴 *Error in `askGroq()`*!!\n" +
        JSON.stringify(error, null, 2).slice(0, 80)
    )
    console.error("🔴 Error in `askGroq()`:", error)
    throw error
  }
}
