import { ethers } from "ethers"
import {
  BLOCK_EXPLORER_URL,
  DONATIONS_CONTRACT_ADDRESS,
  RPC_PROVIDER_URL,
  H3LP_CONTRACT_ADDRESS,
} from "./constants"
import { postToDiscord } from "./discord"

export const sendTokens = async ({
  amountOfGrass,
  recipientAddress,
}: {
  amountOfGrass: string
  recipientAddress: string
}) => {
  const privateKey = process.env.RECEIVER_WALLET_PRIVATE_KEY!
  const tokenDecimals = 18
  const amountToSend = ethers.parseUnits(amountOfGrass, tokenDecimals)

  // Initialize provider and wallet
  const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL)
  const wallet = new ethers.Wallet(privateKey, provider)

  // Contract ABI for the transferFunds method
  const contractAbi = [
    "function transferFunds(address payable recipient, uint256 amount) public",
  ]

  // Initialize contract with your specific address
  const contract = new ethers.Contract(
    DONATIONS_CONTRACT_ADDRESS,
    contractAbi,
    wallet
  )

  // Call transferFunds
  console.log(`Sending tokens to ${recipientAddress}...`)
  const tx = await contract.transferFunds(recipientAddress, amountToSend)

  // Wait for confirmation
  console.log("Transaction sent. Hash:", tx.hash)
  const receipt = await tx.wait()
  console.log("Transaction confirmed in block:", receipt.blockNumber)
  await postToDiscord(`Transaction sent!!! Hash: ${tx.hash}`)

  return true
}

export const getContractBalance = async () => {
  const providerUrl = RPC_PROVIDER_URL
  const provider = new ethers.JsonRpcProvider(providerUrl)
  const balance = await provider.getBalance(DONATIONS_CONTRACT_ADDRESS)
  console.log("🟢 🟢 🟢 🟢 Balance:", balance)
  return balance
}

// {
//   "inputs": [
//     {
//       "internalType": "uint256",
//       "name": "_productId",
//       "type": "uint256"
//     },
//     {
//       "internalType": "uint256",
//       "name": "_price",
//       "type": "uint256"
//     },
//     {
//       "internalType": "address",
//       "name": "_creator",
//       "type": "address"
//     }
//   ],
//   "name": "createProduct",

const h3lpContractAbi = require("./abis/h3lpContractAbi.json")

export const addProduct = async ({
  productId,
  price,
  creator,
}: {
  productId: string
  price: string
  creator: string
}) => {
  try {
    const privateKey = process.env.RECEIVER_WALLET_PRIVATE_KEY!

    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL)
    const wallet = new ethers.Wallet(privateKey, provider)

    // Initialize contract with your specific address
    const contract = new ethers.Contract(
      H3LP_CONTRACT_ADDRESS,
      h3lpContractAbi,
      wallet
    )

    // Call transferFunds
    console.log(`Creating product ${productId}...`)

    const priceInWei = ethers.parseUnits(price, 18)
    console.log(" 🟢 🟢 🟢 🟢 Price in wei:", priceInWei)
    console.log(" 🟢 🟢 🟢 🟢 Creator:", creator)
    console.log(" 🟢 🟢 🟢 🟢 Product ID:", productId)
    const tx = await contract.createProduct(
      productId,
      BigInt(priceInWei),
      creator
    )

    // Wait for confirmation
    console.log(" 🟢 🟢 🟢 🟢 Transaction sent. Hash:", tx.hash)
    const receipt = await tx.wait()
    console.log(
      " 🟢 🟢 🟢 🟢 Transaction confirmed in block:",
      receipt.blockNumber
    )
    await postToDiscord(` 🟢 🟢 🟢 🟢 Transaction sent!!! Hash: ${tx.hash}`)

    await postToDiscord(
      ` 🟢 🟢 🟢 🟢 Product created on the blockchain!!! Hash: ${BLOCK_EXPLORER_URL}/tx/${tx.hash}`
    )
    return tx.hash
  } catch (error) {
    await postToDiscord(`🔴 Error in addProduct: ${error}`)
    console.error("🔴 Error in addProduct:", error)
    return false
  }
}

export const getProductPriceByProductId = async (productId: number) => {
  const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL)
  const contract = new ethers.Contract(
    H3LP_CONTRACT_ADDRESS,
    h3lpContractAbi,
    provider
  )

  try {
    const product = await contract.products(productId.toString())
    const priceInEther = ethers.formatUnits(product.price, 18)
    return priceInEther
  } catch (error) {
    await postToDiscord(
      `🔴 Error in getProductPriceByProductId(${productId}): ${error}`
    )
    console.error("Error al obtener el precio del producto:", error)
  }
}

export const callReleaseFunds = async ({
  productId,
  address,
}: {
  productId: string
  address: string
}): Promise<string | false> => {
  try {
    const privateKey = process.env.RECEIVER_WALLET_PRIVATE_KEY!
    const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL)
    const wallet = new ethers.Wallet(privateKey, provider)

    const contract = new ethers.Contract(
      H3LP_CONTRACT_ADDRESS,
      h3lpContractAbi,
      wallet
    )

    const tx = await contract.releaseFunds(productId, address)
    const receipt = await tx.wait()
    console.log(
      " 🟢 🟢 🟢 🟢 Transaction confirmed in block:",
      receipt.blockNumber
    )
    await postToDiscord(
      ` 🟢 🟢 🟢 🟢 \`releaseFunds()\`Transaction sent!!! Hash: ${tx.hash}`
    )
    return tx.hash
  } catch (error) {
    await postToDiscord(`🔴 Error in callReleaseFunds: ${error}`)
    console.error("🔴 Error in callReleaseFunds:", error)
    return false
  }
}

export const callRefusePurcase = async ({
  productId,
  buyerAddress,
}: {
  productId: string
  buyerAddress: string
}) => {
  const privateKey = process.env.RECEIVER_WALLET_PRIVATE_KEY!
  const provider = new ethers.JsonRpcProvider(RPC_PROVIDER_URL)
  const wallet = new ethers.Wallet(privateKey, provider)

  const contract = new ethers.Contract(
    H3LP_CONTRACT_ADDRESS,
    h3lpContractAbi,
    wallet
  )

  const tx = await contract.rejectPurchase(productId, buyerAddress)
  const receipt = await tx.wait()
  console.log(
    " 🟢 🟢 🟢 🟢 Transaction confirmed in block:",
    receipt.blockNumber
  )
  await postToDiscord(
    ` 🟢 🟢 🟢 🟢 \`rejectPurchase()\`Transaction sent!!! Hash: ${tx.hash}`
  )
  return tx.hash
}
