"use client"

import { PurchaseInProfile } from "@/lib/types"
import MiniTitle from "./MiniTitle"
import { cleanHandle } from "@/lib/strings"

const SaleRowInProfile = ({ sale }: { sale: PurchaseInProfile }) => {
  return (
    <div className="border p-3 rounded-lg shadow-sm shadow-black/10 px-5">
      <MiniTitle>{sale.product_name}</MiniTitle>
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
          <div className="text-xs">@{cleanHandle(sale.purchaser_handle)}</div>
        </div>
      </div>
      <div>{sale.created_at}</div>
    </div>
  )
}

export default SaleRowInProfile
