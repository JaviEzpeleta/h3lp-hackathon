"use client"

import axios from "axios"
import { useEffect, useRef } from "react"
import { useAccount } from "wagmi"
import useStore from "@/lib/zustandStore"

export function SessionController() {
  const loadedRef = useRef(false)
  const { address } = useAccount()
  const { setUserSession, setIsFetchingSession } = useStore()

  useEffect(() => {
    const fetchUserName = async () => {
      const res = await axios.post("/api/get-profile-by-address", {
        address,
      })
      const profile = res.data.data

      console.log("🟢 profile:", profile)

      setUserSession(profile)
      setIsFetchingSession(false)
    }
    if (address) {
      if (!loadedRef.current) {
        loadedRef.current = true
        fetchUserName()
      }
    }
  }, [address])
  return null
}
