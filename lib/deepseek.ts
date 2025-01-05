import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
})

export const askDeepSeek = async ({ messages }: { messages: any[] }) => {
  console.log(" 🧠  DeepSeek QUERY STARTED")

  const completion = await openai.chat.completions.create({
    messages,
    model: "deepseek-chat",
  })

  console.log(" 🧠  DeepSeek QUERY COMPLETED")

  console.log(completion.choices[0].message.content)
}
