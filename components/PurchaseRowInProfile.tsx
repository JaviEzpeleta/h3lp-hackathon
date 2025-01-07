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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import Title from "./Title"

const PurchaseRowInProfile = ({
  purchase,
  index,
}: {
  purchase: PurchaseInProfile
  index: number
}) => {
  const { toast } = useToast()

  const { userSession } = useStore()
  const [isLoading, setIsLoading] = useState(false)

  const acceptPurchase = async () => {
    if (!userSession) return
    setIsLoading(true)
    try {
      const res = await axios.post("/api/purchase/accept", {
        purchase_id: purchase.id,
        address: userSession.address,
      })
      toast({
        title: "Purchase accepted",
        description: res.data.message,
      })
    } finally {
      setIsLoading(false)
      window.location.reload()
    }
  }

  const refusePurchase = async () => {
    if (!userSession) return
    setIsLoading(true)
    try {
      const res = await axios.post("/api/purchase/refuse", {
        purchase_id: purchase.id,
        address: userSession.address,
      })
      toast({
        title: "Purchase refused",
        description: res.data.message,
      })
    } finally {
      setIsLoading(false)
      window.location.reload()
    }
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
            ) : purchase.status === "regretted" ? (
              <div className="text-red-600 text-sm font-semibold text-center bg-red-100 px-2 py-1 rounded-md">
                🙅 You asked for a refund
              </div>
            ) : (
              <div>STATUS NOT HANDLED YET: {purchase.status}</div>
            )}
          </div>
        </div>
      </div>
      <AlertDialog open={isLoading}>
        <AlertDialogContent className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <AlertDialogTitle>
            <Title>Processing...</Title>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="text-lg text-center">
              Please wait while we process your request
            </div>
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </BlurryEntrance>
  )
}

export default PurchaseRowInProfile
