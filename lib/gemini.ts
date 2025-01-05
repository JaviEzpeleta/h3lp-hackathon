import { FLASH_LATEST } from "./constants"

const { GoogleGenerativeAI } = require("@google/generative-ai")
const { GoogleAIFileManager } = require("@google/generative-ai/server")
const fs = require("fs").promises
const path = require("path")

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_GEMINI_API_KEY)

export const getImageDescription = async ({
  imageUrl,
}: {
  imageUrl: string
}) => {
  console.log(" 👀 Calling Gemini Vision...")

  const model = genAI.getGenerativeModel({ model: FLASH_LATEST })

  const currentYear = new Date().getFullYear()
  const fileName = `${currentYear}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}-${new Date().getSeconds()}.png`
  // Create temp file path
  const tempPath = path.join(process.cwd(), "temp", fileName)

  const prompt = `Describe this screenshot. Include the text inside (if any) and the shapes, colors of the image, and other details you consider relevant so your response will be used to search semantically. Be concise. Thank you so much!!!!
  
Reply in JSON format, following this structure:
{
  "title": "...", // no more than 5 words
  "description": "..." // no more than 100 words
}`

  try {
    // Fetch and save image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${response.statusText}`)
    }
    const imageArrayBuffer = await response.arrayBuffer()

    const imageBuffer = Buffer.from(imageArrayBuffer)

    // Ensure temp directory exists
    await fs.mkdir(path.dirname(tempPath), { recursive: true })
    await fs.writeFile(tempPath, imageBuffer)

    // Upload the saved image
    const uploadResult = await fileManager.uploadFile(path.resolve(tempPath), {
      mimeType: "image/webp",
      displayName: "Uploaded Image",
    })

    // Generate content
    const result = await model.generateContent([
      prompt,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ])

    const responseText = result.response.text()

    const cleanedResponseText = responseText.replace(/```json|```/g, "")

    console.log(
      " 🧐 🧐 🧐 🧐 🧐 🧐 🧐 🧐 RESPONSE FROM GEMINI: ",
      cleanedResponseText
    )
    // parse the json to an object
    const { title, description } = JSON.parse(cleanedResponseText)

    return title + " ::: " + description
  } catch (error) {
    console.error("Error in askGeminiWithVision:", error)
    return "Error in askGeminiWithVision"
  }
}

// export const getImageDescription = async (
//   imageUrl: string
// ): Promise<string | false> => {
//   const randomNumberFrom1To100 = Math.floor(Math.random() * 100) + 1
//   const fruits = ["pera", "manzana", "naranja", "plátano", "uva"]
//   const colors = ["rojo", "verde", "amarillo", "azul", "morado"]
//   if (randomNumberFrom1To100 < 12) {
//     return false
//   }
//   return (
//     fruits[Math.floor(Math.random() * fruits.length)] +
//     " de color " +
//     colors[Math.floor(Math.random() * colors.length)]
//   )
// }
