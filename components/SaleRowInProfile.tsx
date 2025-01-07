"use client"

import { PurchaseInProfile } from "@/lib/types"
import MiniTitle from "./MiniTitle"
import { cleanHandle } from "@/lib/strings"
import { timeSince } from "../lib/time"
import Link from "next/link"
import BlurryEntrance from "./BlurryEntrance"
import { Button } from "./ui/button"

const SaleRowInProfile = ({
  sale,
  index,
}: {
  sale: PurchaseInProfile
  index: number
}) => {
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
          <div>
            <div>{timeSince(new Date(sale.created_at).getTime())}</div>
            <div>{sale.status}</div>
            {sale.status === "pending" ? (
              <div className="flex items-center gap-2">
                <Button>Accept</Button>
                <Button>Refuse</Button>
              </div>
            ) : (
              <div>STATUS NOT HANDLED YET</div>
            )}
          </div>
        </div>
      </div>
    </BlurryEntrance>
  )
}

export default SaleRowInProfile
