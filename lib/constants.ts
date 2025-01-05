export const MAX_PUBLICATIONS_WHEN_PARSING_PROFILE = 300

export const FLASH_LATEST = "gemini-1.5-flash-latest"

export const SEARCH_GOOGLE_NUM_RESULTS = 10

// export const SIMULATE_PRODUCTION = false
export const SIMULATE_PRODUCTION =
  process.env.NODE_ENV === "production" || false

// export const FORCE_GAME_MODE = true
export const FORCE_GAME_MODE = false

export const ADMIN_USERNAMES = ["javitoshi", "ezpe"]

// export const MAX_TWEET_CALL_COUNT = 1
export const MAX_TWEET_CALL_COUNT = 20

export const TOTAL_MOVIE_CHAPTERS = 4
export const FREE_CREDITS_BY_DEFAULT = 50

export const IS_LOCALHOST = process.env.NODE_ENV === "development"

export const DEFAULT_JOB_CHECKING_INTERVAL = 1000000 //10000
export const USER_DEFAULT_STAR_CREDITS = 200

export const FLUX_DEV = "black-forest-labs/flux-dev"
export const FLUX_SCHNELL = "black-forest-labs/flux-schnell"
export const FLUX_PRO = "black-forest-labs/flux-pro"

export const ANTHROPIC_HAIKU_MODEL = "claude-3-haiku-20240307"
export const ANTHROPIC_SONNET_MODEL = "claude-3-5-sonnet-20241022"
export const ANTHROPIC_OPUS_MODEL = "claude-3-opus-20240229"
export const O1Preview = "o1-preview-2024-09-12"
export const O1Mini = "o1-mini-2024-09-12"
export const GPT4o = "gpt-4o"
export const GPT4oB = "gpt-4o-2024-08-06"
export const GPT3_5_TURBO = "gpt-3.5-turbo"
export const GPT4oMini = "gpt-4o-mini"

export const DISCORD_VISITS_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1281995298712846509/XtSvHg7GB5z3VNm8e6bdH-d32uGVvBKsMcj40_gbomop_l4qX3vtPQyzbWSB2Kb5lTMt"

export const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1257350141505966185/REzknojXsYeOoHuiKr14MnUlxgElvtLDAcpW0fGElTwPnZy9tGNENMBhcOl6ZTncF2DY"

export const DISCORD_WEBHOOK_ERRORS_URL =
  "https://discord.com/api/webhooks/1257350986046111754/hKHqJw1O_Wv_owlfqR9GRXzpJCkLaHq1FHlfKgI8019AAO3DQFmIlmP51Vb7WXt7JXYU"

export const SEND_FROM = "smol apps<hi@smolapps.com>"
export const SEND_TO = "javierezpeleta@gmail.com"

export const ELECTRON_DEEP_LINK_URL = "smolapp://callback?token=xyz123"

export const DOMAINS_TO_IGNORE = [
  "youtube.com",
  "facebook.com",
  "twitter.com",
  "reddit.com",
  "linkedin.com",
  "instagram.com",
  "pinterest.com",
  "wiley.com",
  "google.com",
]

export const BONSAI_TOKEN_ADDRESS = "0x3d2bd0e15829aa5c362a4144fdf4a1112fa29b5c"

export const LENS_RECEIVER_ADDRESS =
  "0x80f0Afc3d8C52EDbFFaCc015C46F4f40a87D064e"

export const LENS_SENDER_ADDRESS = "0xA120be146ae48E2131d7e56CAE7586d7D036EE94"

export const GRASS_TOKEN_ADDRESS = "0x000000000000000000000000000000000000800A"

export const DONATIONS_CONTRACT_ADDRESS =
  "0x7D58E6c2DeC0C2777b90d8A64506b3d828ee8568"

export const RPC_PROVIDER_URL = "https://rpc.testnet.lens.dev"
export const BLOCK_EXPLORER_URL = "https://block-explorer.testnet.lens.dev"

export const SMOL_GUMROAD_CONTRACT_ADDRESS =
  "0x843E33e732F20900E6CE9C64EE075Eb5a1CB1fff"

export const PROFILE_PAGES_TO_PARSE = 12

// export const GROQ_MODEL = "llama3-groq-70b-8192-tool-use-preview"
export const GROQ_MODEL = "llama3-70b-8192"
