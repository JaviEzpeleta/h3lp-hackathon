// prices-alchemy-sdk-script.js
import { Alchemy, Network } from "alchemy-sdk"
import {
  BONSAI_TOKEN_ADDRESS,
  GRASS_TOKEN_ADDRESS,
  RPC_PROVIDER_URL,
} from "./constants"
import { ethers } from "ethers"

type TokenPrice = {
  price: number
  symbol: string
}

const POOL_ABI = [
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      {
        internalType: "uint112",
        name: "_reserve0",
        type: "uint112",
      },
      {
        internalType: "uint112",
        name: "_reserve1",
        type: "uint112",
      },
      {
        internalType: "uint32",
        name: "_blockTimestampLast",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

export async function getPriceBySymbol(
  symbol: string
): Promise<TokenPrice | null> {
  try {
    const alchemy = new Alchemy({ apiKey: process.env.ALCHEMY_API_KEY || "" })

    // console.log("ASKING........")

    const { data } = (await alchemy.prices.getTokenPriceByAddress([
      {
        address: BONSAI_TOKEN_ADDRESS,
        network: Network.MATIC_MAINNET,
      },
    ])) as any
    console.log("🟢 🟢 🟢 🟢 Got data:", data)
    if (data && data[0]) console.log("🟢 🟢 🟢 🟢 Got prices:", data[0].prices)

    if (!data) {
      console.log(" 🚳  No data for BONSAI")
      return null
    }
    if (!data[0]) {
      return null
    }

    const theValue = data[0].prices[0].value
    console.log("🟢 🟢 🟢 🟢 Got the value:", theValue)
    return theValue
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error)
    return null
  }
}

export async function getGrassPrice(): Promise<TokenPrice | null> {
  try {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${GRASS_TOKEN_ADDRESS}`
    console.log("🟢 🟢 🟢 🟢 Fetching GRASS price from:", url)
    const response = await fetch(url)

    const data = await response.json()

    if (data?.pairs?.[0]) {
      return {
        price: parseFloat(data.pairs[0].priceUsd),
        symbol: "GRASS",
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching GRASS price:", error)
    return null
  }
}

export async function getGrassPriceFromPool(): Promise<TokenPrice | null> {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL)

    // Debug: Veamos qué hay en esta dirección
    console.log("Checking address:", GRASS_TOKEN_ADDRESS)
    const code = await provider.getCode(GRASS_TOKEN_ADDRESS)
    console.log("Contract code exists:", code !== "0x")

    // Si necesitamos encontrar el pool primero:
    // const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider)
    // const poolAddress = await factoryContract.getPool(GRASS_TOKEN_ADDRESS, WETH_ADDRESS, FEE_TIER)

    const poolContract = new ethers.Contract(
      GRASS_TOKEN_ADDRESS,
      POOL_ABI,
      provider
    )

    const reserves = await poolContract.getReserves()
    console.log("Reserves:", reserves)

    return {
      price: reserves ? reserves[1] / reserves[0] : 0,
      symbol: "GRASS",
    }
  } catch (error) {
    console.error("Error en Lens Testnet:", error)
    return null
  }
}
