"use client"

import LoadingIndicator from "@/components/LoadingIndicator"
import { Button } from "@/components/ui/button"
import {
  BLOCK_EXPLORER_URL,
  SMOL_GUMROAD_CONTRACT_ADDRESS,
} from "@/lib/constants"
import { Product, ProductInList } from "@/lib/types"
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
import BigTitle from "@/components/BigTitle"
import MiniTitle from "@/components/MiniTitle"
import BigPriceTag from "@/components/BigPriceTag"
import { cleanHandle } from "@/lib/strings"
import { useToast } from "@/hooks/use-toast"

const ProductPage = () => {
  const { productId } = useParams() as { productId: string }
  const [loading, setLoading] = useState(true)
  //   const product = (await getProductById(productId)) as Product

  const [product, setProduct] = useState<ProductInList | null>(null)

  const { address } = useAccount()
  const { data: balance } = useBalance({
    address,
  })

  const loadedRef = useRef(false)
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      const res = await axios.post("/api/products/get", { productId })
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

  const { toast } = useToast()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    if (isConfirmed && hash) {
      axios.post("/api/products/buy", {
        productId,
        userAddress: address,
        txHash: hash,
      })
      toast({
        title: "Purchase confirmed successfully!",
        description: `LFG LFG LFG Transaction Hash: ${hash}`,
      })
    }
  }, [isConfirmed, hash])

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
    <div className="max-w-5xl mx-auto px-2 pt-32 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:gap-8 justify-between">
        <div className="flex-1">
          <BigTitle>{product.name}</BigTitle>
        </div>
        <div className="translate-y-3">
          <div className="flex">
            <BigPriceTag>{product.price} $GRASS</BigPriceTag>
          </div>
          <div className="pt-3 flex md:justify-end">
            {product.inspired_by_publication_ids.map((id, index) => (
              <div key={index}>
                <Link
                  href={`https://hey.xyz/posts/${id}`}
                  target="_blank"
                  className="border border-transparent rounded-md hover:border-black/20 hover:scale-[112%] 
                            transition-all active:scale-95 active:opacity-50 group inline-block"
                >
                  <div
                    className="rounded-md opacity-75 group-hover:opacity-100 p-1 group-active:rotate-[360deg]
                       bg-transparent group-hover:bg-white/50 group-hover:rotate-[180deg] transition-all"
                  >
                    <img src="/img/hey-icon.png" className="w-5 md:w-7" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-full"
          style={{
            backgroundImage: `url(${product.creator.profile_picture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div>
          <MiniTitle>{product.creator.display_name}</MiniTitle>
          <div className="text-sm text-zinc-500">
            @{cleanHandle(product.creator.handle)}
          </div>
        </div>
      </div>
      <MiniTitle>{product.description}</MiniTitle>
      <div className="py-3">
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
      </div>

      <div className="flex justify-center">
        <div className="p-6 bg-zinc-100 rounded-lg flex flex-col items-center justify-center gap-2">
          <div className="flex">
            <MiniTitle>
              You have: {/* <div className="p-2 bg-zinc-900 rounded-md"> */}
              {balance
                ? Number(formatUnits(balance.value, 18)).toFixed(2)
                : 0}{" "}
              $GRASS
              {/* </div> */}
            </MiniTitle>
          </div>
          <div>
            <Button
              size="xl"
              onClick={launchBuy}
              disabled={isPending || isConfirming}
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isPending ? "In progress..." : "Waiting for confirmation..."}
                </>
              ) : (
                `Buy for ${product?.price} $GRASS`
              )}
            </Button>
          </div>
        </div>
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
