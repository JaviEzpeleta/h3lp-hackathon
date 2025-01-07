"use client"

import ShimmerLoading from "@/components/ShimmerLoading"
import { ConnectKitButton } from "connectkit"
import { useAccount } from "wagmi"
import { Button } from "./ui/button"
import Link from "next/link"
import LoadingComponent from "./LoadingComponent"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import axios from "axios"
import { LensSavedProfile } from "@/lib/types"
import BlurryEntrance from "./BlurryEntrance"

const SignInOrNot = () => {
  const { address } = useAccount()
  const [userProfile, setUserProfile] = useState<LensSavedProfile | null>(null)

  useEffect(() => {
    const fetchUserProfileByAddress = async (address: string) => {
      const res = await axios.post("/api/profile/get", {
        address,
      })
      if (res.data.success) {
        setUserProfile(res.data.data)
      }
    }

    if (address) {
      console.log(" 🔥  address i'm gonna search the user for...", address)

      fetchUserProfileByAddress(address)
    }
  }, [address])

  return (
    <div className="p-12 rounded-xl border-2 border-dashed border-stone-200">
      <AnimatePresence>
        {!address ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <ConnectKitButton />
          </motion.div>
        ) : (
          <>
            {userProfile ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <Link href="/home">
                  <Button size="xl">Start using H3lp</Button>
                </Link>
              </motion.div>
            ) : (
              <div className="flex flex-col justify-center items-center gap-4">
                <LoadingComponent />
                <BlurryEntrance delay={6}>
                  <div>
                    You don&apos;t have a profile yet so the AI is processing
                    your publications
                  </div>
                </BlurryEntrance>
                <BlurryEntrance delay={16}>
                  <div>It might take like 30 seconds.. sorry!</div>
                </BlurryEntrance>
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SignInOrNot
