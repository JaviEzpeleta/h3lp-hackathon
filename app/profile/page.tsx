"use client"

import LoadingIndicator from "@/components/LoadingIndicator"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import useStore from "@/lib/zustandStore"
import { cleanHandle } from "../../lib/strings"
import BigTitle from "@/components/BigTitle"
import Title from "@/components/Title"

const ProfilePage = () => {
  const router = useRouter()
  const { userSession, isFetchingSession } = useStore()

  useEffect(() => {
    if (!isFetchingSession && !userSession) {
      router.push("/")
    }
  }, [userSession, isFetchingSession])

  if (isFetchingSession) {
    return <LoadingIndicator />
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
    </div>
  )
}

export default ProfilePage
