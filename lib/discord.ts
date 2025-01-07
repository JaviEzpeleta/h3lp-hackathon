import axios from "axios"
import { DISCORD_WEBHOOK_ERRORS_URL, DISCORD_WEBHOOK_URL } from "./constants"

export const postErrorToDiscord = async (message: string) => {
  const params = {
    username: "gptlife-ERROR",
    content: message,
  }
  try {
    await axios.post(DISCORD_WEBHOOK_ERRORS_URL, params)
  } catch (error) {
    console.log(" - 🧠 Error posting to Discord (1) ((`postErrorToDiscord()`))")
  }
}

export const postToDiscord = async (message: string) => {
  const params = {
    username: "smol-logger",
    content: message,
  }
  try {
    await axios.post(DISCORD_WEBHOOK_URL, params)
  } catch (error) {
    console.log(" - 🧠 Error posting to Discord (2) (probably 429)")
  }
}
