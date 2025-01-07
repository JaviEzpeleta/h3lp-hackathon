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

const SaleRowInProfile = ({
  sale,
  index,
}: {
  sale: PurchaseInProfile
  index: number
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const { userSession } = useStore()
  const acceptSale = async () => {
    if (!userSession) return
    setIsLoading(true)
    try {
      const res = await axios.post("/api/sale/accept", {
        sale_id: sale.id,
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

  const refuseSale = async () => {
    if (!userSession) return
    setIsLoading(true)
    try {
      const res = await axios.post("/api/sale/refuse", {
        sale_id: sale.id,
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
    <>
      <BlurryEntrance delay={index * 0.08}>
        <div className="border p-3 rounded-lg shadow-sm shadow-black/10 px-5 bg-white/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-70">
                {timeSince(new Date(sale.created_at).getTime())}
              </div>
              <Link
                href={`/product/${sale.product_id}`}
                className="text-indigo-600 hover:text-indigo-500 active:opacity-50"
              >
                <MiniTitle>{sale.product_name}</MiniTitle>
              </Link>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-black/40"
                  style={{
                    backgroundImage: `url(${sale.purchaser_profile_picture})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div>
                  <div className="font-bold">{sale.purchaser_display_name}</div>
                  <div className="text-xs">
                    @{cleanHandle(sale.purchaser_handle)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end justify-end">
              <div className="font-semibold font-mono text-2xl">
                {sale.amount}
                <span className="text-sm pl-1">GRASS</span>
              </div>
              {sale.status === "pending" ? (
                <div className="flex items-center gap-2">
                  <Button onClick={acceptSale} variant="outline">
                    ✅ <b>Accept</b>
                  </Button>
                  <Button onClick={refuseSale} variant="destructive">
                    <b>Refuse</b>
                  </Button>
                </div>
              ) : sale.status === "accepted" ? (
                <div className="text-green-600 text-sm font-semibold text-center bg-green-100 px-2 py-1 rounded-md">
                  ✅ Money Received in your wallet!
                </div>
              ) : sale.status === "refused" ? (
                <div className="text-red-600 text-sm font-semibold text-center bg-red-100 px-2 py-1 rounded-md">
                  😿 Refused by you
                </div>
              ) : sale.status === "regretted" ? (
                <div className="text-red-600 text-sm font-semibold text-center bg-red-100 px-2 py-1 rounded-md">
                  😿 Regretted by {sale.purchaser_display_name}
                </div>
              ) : (
                <div>STATUS NOT HANDLED YET: {sale.status}</div>
              )}
            </div>
          </div>
        </div>
      </BlurryEntrance>
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
    </>
  )
}

export default SaleRowInProfile
