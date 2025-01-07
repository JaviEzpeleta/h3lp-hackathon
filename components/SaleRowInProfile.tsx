"use client"

import { PurchaseInProfile } from "@/lib/types"
import MiniTitle from "./MiniTitle"
import { cleanHandle } from "@/lib/strings"
import { timeSince } from "../lib/time"
import Link from "next/link"
import BlurryEntrance from "./BlurryEntrance"
import { Button } from "./ui/button"
import axios from "axios"
import { useAccount } from "wagmi"
import useStore from "@/lib/zustandStore"

const SaleRowInProfile = ({
  sale,
  index,
}: {
  sale: PurchaseInProfile
  index: number
}) => {
  const { userSession } = useStore()
  const acceptSale = async () => {
    if (!userSession) return
    const res = await axios.post("/api/sale/accept", {
      sale_id: sale.id,
      address: userSession.address,
    })

    const data = res.data
    console.log("accept sale response::::")
    console.log(data)
  }

  const refuseSale = async () => {
    if (!userSession) return
    const res = await axios.post("/api/sale/refuse", {
      sale_id: sale.id,
      address: userSession.address,
    })

    const data = res.data
    console.log("refuse sale response::::")
    console.log(data)
  }
  return (
    <BlurryEntrance delay={index * 0.08}>
      <div className="border p-3 rounded-lg shadow-sm shadow-black/10 px-5 bg-white/30">
        <div className="flex items-center justify-between">
          <div>
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
            <div>{timeSince(new Date(sale.created_at).getTime())}</div>
            <div className="font-semibold font-mono text-2xl">
              {sale.amount}
              <span className="text-sm pl-1">GRASS</span>
            </div>
            {sale.status === "pending" ? (
              <div className="flex items-center gap-2">
                <Button onClick={acceptSale}>Accept</Button>
                <Button onClick={refuseSale}>Refuse</Button>
              </div>
            ) : sale.status === "accepted" ? (
              <div className="text-green-600 text-sm font-semibold text-center bg-green-100 px-2 py-1 rounded-md">
                ✅ Money Received!
              </div>
            ) : (
              <div>STATUS NOT HANDLED YET: {sale.status}</div>
            )}
          </div>
        </div>
      </div>
    </BlurryEntrance>
  )
}

export default SaleRowInProfile
