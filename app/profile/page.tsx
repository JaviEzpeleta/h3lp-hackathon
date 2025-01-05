"use client"
import LoadingIndicator from "@/components/LoadingIndicator"
import { useAccount } from "wagmi"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const ProfilePage = () => {
  const router = useRouter()
  const { isDisconnected, isConnecting } = useAccount()

  useEffect(() => {
    if (!isConnecting && isDisconnected) {
      router.push("/")
    }
  }, [isDisconnected, isConnecting])

  if (isConnecting) {
    return <LoadingIndicator />
  }
  return <div>ProfilePage</div>
}

export default ProfilePage
