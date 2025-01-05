"use client"

import LoadingIndicator from "@/components/LoadingIndicator"
import { Button } from "@/components/ui/button"
import {
  BLOCK_EXPLORER_URL,
  SMOL_GUMROAD_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { Product } from "@/lib/types"
import axios from "axios"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { useState } from "react"
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
  useAccount,
} from "wagmi"
import { formatUnits, parseEther } from "viem"
import smolGumroadAbi from "@/lib/abis/smolGumroad.json"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const ProductPage = () => {
  const { productId } = useParams() as { productId: string }
  const [loading, setLoading] = useState(true)
  //   const product = (await getProductById(productId)) as Product

  const [product, setProduct] = useState<Product | null>(null)

  const { address } = useAccount()
  const { data: balance } = useBalance({
    address,
  })

  const loadedRef = useRef(false)
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      const res = await axios.post("/api/product/get", { productId })
      setProduct(res.data.data)
      setLoading(false)
    }
    if (!loadedRef.current) {
      fetchProduct()
      loadedRef.current = true
    }
  }, [productId])

  const [error, setError] = useState<string>("")

  const { data: hash, isPending, writeContract } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const launchBuy = async () => {
    try {
      if (!product) return

      writeContract({
        address: SMOL_GUMROAD_CONTRACT_ADDRESS,
        abi: smolGumroadAbi,
        functionName: "buyProduct",
        args: [BigInt(productId)],
        value: parseEther(product.price.toString()),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to buy product")
    }
  }

  if (loading)
    return (
      <div className="p-40">
        <LoadingIndicator />
      </div>
    )
  if (!product)
    return (
      <div className="p-40">
        <p className="text-2xl font-bold">No product found!</p>
      </div>
    )

  return (
    <div className="p-40">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p className="text-sm text-slate-300">{product.description}</p>
      <p className="text-sm text-slate-300">{product.price} $GRASS</p>
      <p className="text-sm text-slate-300">{product.deadline}</p>
      <p className="text-sm text-slate-300">{product.address}</p>
      <p className="text-sm text-slate-300">
        <Link
          href={`${BLOCK_EXPLORER_URL}/tx/${product.tx_hash}`}
          target="_blank"
          // className="text-sm text-indigo-300 hover:text-indigo-400 transition-all ease-out active:opacity-50"
        >
          <Button variant="outline">
            <div className="flex items-center gap-2">
              <ExternalLink size={16} />
              <div>creation tx on block explorer</div>
            </div>
          </Button>
        </Link>
      </p>
      <div className="flex">
        <div className="p-2 bg-zinc-900 rounded-md">
          {balance ? Number(formatUnits(balance.value, 18)).toFixed(2) : 0}{" "}
          $GRASS
        </div>
      </div>
      <div>
        <Button onClick={launchBuy} disabled={isPending || isConfirming}>
          {isPending || isConfirming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isPending ? "Confirming..." : "Waiting for confirmation..."}
            </>
          ) : (
            `Buy for ${product?.price} $GRASS`
          )}
        </Button>
      </div>

      {hash && (
        <Alert>
          <AlertDescription className="font-mono break-all">
            Transaction Hash: {hash}
          </AlertDescription>
        </Alert>
      )}

      {isConfirmed && (
        <Alert>
          <AlertDescription>Purchase confirmed successfully!</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default ProductPage
