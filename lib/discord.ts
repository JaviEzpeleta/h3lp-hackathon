import axios from "axios"
import {
  DISCORD_VISITS_WEBHOOK_URL,
  DISCORD_WEBHOOK_ERRORS_URL,
  DISCORD_WEBHOOK_URL,
  IS_LOCALHOST,
} from "./constants"

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

export const postWebVisitToDiscord = async (message: string) => {
  console.log(" ABOUT TO TRACK THIS VISIT.... 🔥")

  // if (IS_LOCALHOST) return false
  const params = {
    username: "smol-tracker",
    content: message,
  }
  try {
    if (DISCORD_VISITS_WEBHOOK_URL)
      axios.post(DISCORD_VISITS_WEBHOOK_URL, params)
  } catch (error) {
    console.error(" 🔴 postWebVisitToDiscord error:", error)
  }
}

export const getEventLogEmoji = (event_type: string) => {
  const emojiMap: { [key: string]: string } = {
    twitter_handle_search: "🔍",
    twitter_handle_search_existing: "🔍🥳",
    twitter_process_found: "🔍✅",
    movie_frame_generated: "🎞️",
    motivational_session_created: "🔥",
    new_movie_created: "🆕🎞️",
    user_created: "🐣",
    user_logged_in: "👋",
    user_logged_out: "💨",
    purchase_made: "💳",
    visited_stripe: "🏦",
    welcome_email_sent: "📧",
    podcast_search_by_name: "🔍",
    user_rss_read: "📡",
    podcast_deleted: "🗑️",
    podcast_member_added: "👥",
    team_member_added: "👥",
    fetched_youtube_playlists: "📺",
    episodes_inserted: "✅",
    episode_inserted: "🎙️",
    role_assigned_to_podcast_member: "🔖",
    team_created: "🏗️",
    youtube_tokens_saved: "🔑",
    member_removed: "🛑",
    role_removed: "❌",
    podcast_created: "🆕",
    mobile_api_me: "📱",
    mobile_api_auth: "📱",
    role_assigned: "🔖",
    user_deleted: "🗑️",
    user_updated: "🔄",
    user_password_reset: "🔑",
    user_email_changed: "📧",
    user_display_name_changed: "📛",
    user_photo_url_changed: "🖼️",
    user_origin_changed: "🌍",
    user_email_verification_sent: "📧",
    user_email_verified: "📧",
    user_email_verification_failed: "📧",
    user_password_reset_sent: "🔑",
    user_password_reset_failed: "🔑",
    user_password_reset_successful: "🔑",
  }
  return emojiMap[event_type] || "❓"
}
