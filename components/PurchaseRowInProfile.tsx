"use client"

import { PurchaseInProfile } from "@/lib/types"
import MiniTitle from "./MiniTitle"
import { cleanHandle } from "@/lib/strings"
import { timeSince } from "../lib/time"
import Link from "next/link"
import BlurryEntrance from "./BlurryEntrance"
import { Button } from "./ui/button"
import axios from "axios"
import useStore from "@/lib/zustandStore"
import { useToast } from "@/hooks/use-toast"

const PurchaseRowInProfile = ({
  purchase,
  index,
}: {
  purchase: PurchaseInProfile
  index: number
}) => {
  const { toast } = useToast()

  const { userSession } = useStore()
  const acceptPurchase = async () => {
    if (!userSession) return
    const res = await axios.post("/api/purchase/accept", {
      purchase_id: purchase.id,
      address: userSession.address,
    })

    const data = res.data
    console.log("accept purchase response::::")
    console.log(data)

    toast({
      title: "Purchase accepted",
      description: data.message,
    })
  }

  const refusePurchase = async () => {
    if (!userSession) return
    const res = await axios.post("/api/purchase/refuse", {
      purchase_id: purchase.id,
      address: userSession.address,
    })

    const data = res.data
    console.log("refuse purchase response::::")
    console.log(data)

    toast({
      title: "Purchase refused",
      description: data.message,
    })
  }
  return (
    <BlurryEntrance delay={index * 0.08}>
      <div className="border p-3 rounded-lg shadow-sm shadow-black/10 px-5 bg-white/30">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href={`/product/${purchase.product_id}`}
              className="text-indigo-600 hover:text-indigo-500 active:opacity-50"
            >
              <MiniTitle>{purchase.product_name}</MiniTitle>
            </Link>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-black/40"
                style={{
                  backgroundImage: `url(${purchase.creator_profile_picture})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div>
                <div className="font-bold">{purchase.creator_display_name}</div>
                <div className="text-xs">
                  @{cleanHandle(purchase.creator_handle)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end justify-end">
            <div className="text-xs opacity-70">
              {timeSince(new Date(purchase.created_at).getTime())}
            </div>
            <div className="font-semibold font-mono text-2xl">
              {purchase.amount}
              <span className="text-sm pl-1">GRASS</span>
            </div>
            {purchase.status === "pending" ? (
              <div className="flex items-center gap-2">
                <Button onClick={acceptPurchase} variant="outline">
                  ✅ <b>I got it!</b>
                </Button>
                <Button onClick={refusePurchase} variant="destructive">
                  🙅 <b>I regret it... Refund</b>
                </Button>
              </div>
            ) : purchase.status === "accepted" ? (
              <div className="text-green-600 text-sm font-semibold text-center bg-green-100 px-2 py-1 rounded-md">
                ✅ Completed!
              </div>
            ) : purchase.status === "refused" ? (
              <div className="text-red-600 text-sm font-semibold text-center bg-red-100 px-2 py-1 rounded-md">
                😿 Refused by {purchase.creator_display_name}
              </div>
            ) : purchase.status === "confirmed" ? (
              <div className="text-green-600 text-sm font-semibold text-center bg-green-100 px-2 py-1 rounded-md">
                ✅ Completed!
              </div>
            ) : (
              <div>STATUS NOT HANDLED YET: {purchase.status}</div>
            )}
          </div>
        </div>
      </div>
    </BlurryEntrance>
  )
}

export default PurchaseRowInProfile
