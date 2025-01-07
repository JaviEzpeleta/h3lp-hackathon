"use client"

import LoadingIndicator from "@/components/LoadingIndicator"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useStore from "@/lib/zustandStore"
import { cleanHandle } from "../../lib/strings"
import BigTitle from "@/components/BigTitle"
import Title from "@/components/Title"
import axios from "axios"
import LoadingComponent from "@/components/LoadingComponent"
import SaleRowInProfile from "@/components/SaleRowInProfile"
import PurchaseRowInProfile from "@/components/PurchaseRowInProfile"
import { PurchaseInProfile } from "@/lib/types"
const ProfilePage = () => {
  const router = useRouter()
  const { userSession, isFetchingSession } = useStore()

  const [sales, setSales] = useState([])
  const [purchases, setPurchases] = useState([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    if (!isFetchingSession && !userSession) {
      router.push("/")
    }
  }, [userSession, isFetchingSession])

  useEffect(() => {
    const fetchSalesAndPurchases = async () => {
      if (!userSession) return
      const res = await axios.post("/api/get-sales-and-purchases", {
        handle: userSession.handle,
      })
      console.log(res.data)
      setSales(res.data.data.sales)
      setPurchases(res.data.data.purchases)
      setIsFetching(false)
    }
    if (userSession) {
      fetchSalesAndPurchases()
      // setHandle(userSession?.handle.replace("lens/", "") || "")
    }
  }, [userSession])

  if (isFetchingSession || isFetching) {
    return (
      <div className="max-w-5xl mx-auto px-2 py-60 space-y-4 w-full flex flex-col items-center justify-center">
        <LoadingIndicator />
        <LoadingComponent />
      </div>
    )
  }
  if (!userSession) {
    return (
      <div className="max-w-5xl mx-auto px-2 py-32 space-y-4 w-full">
        <p className="text-2xl font-bold">No profile found!</p>
      </div>
    )
  }
  return (
    <div className="max-w-5xl mx-auto px-2 py-32 space-y-4 w-full">
      <div className="flex items-center gap-2">
        <div
          className="w-28 h-28 rounded-full bg-zinc-200 border-2 border-black/40"
          style={{
            backgroundImage: `url(${userSession.profile_picture})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div>
          <BigTitle>{userSession.display_name}</BigTitle>
          <Title>
            <div className="opacity-60">@{cleanHandle(userSession.handle)}</div>
          </Title>
        </div>
      </div>
      {sales.length > 0 && (
        <div className="bg-zinc-100 rounded-2xl p-4 px-6 space-y-4">
          <Title>Sales</Title>
          <div className="flex flex-col gap-2 py-2">
            {sales.map((sale: PurchaseInProfile, index) => (
              <SaleRowInProfile sale={sale} key={index} index={index} />
            ))}
          </div>
        </div>
      )}

      {purchases.length > 0 && (
        <div className="bg-zinc-100 rounded-2xl p-4 space-y-4">
          <Title>Things you paid for</Title>
          <div className="flex flex-col gap-2">
            {purchases.map((purchase: PurchaseInProfile, index) => (
              <PurchaseRowInProfile
                purchase={purchase}
                key={index}
                index={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
