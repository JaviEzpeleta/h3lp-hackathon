"use client"

import { DisconnectWalletButton } from "./DisconnectWalletButton"
import LoadingIndicator from "./LoadingIndicator"
import { usePathname, useRouter } from "next/navigation"
import useStore from "@/lib/zustandStore"
import { useToast } from "@/hooks/use-toast"

const LoggedInUserButton = () => {
  const { toast } = useToast()

  const router = useRouter()
  const pathname = usePathname()

  const { userSession, isFetchingSession } = useStore()

  const handleClick = () => {
    if (!userSession) return
    if (pathname === "/profile") {
      const toastInstance = toast({
        title: "Logged in as",
        description: (
          <div className="flex flex-col gap-2 w-full min-w-[22rem]">
            <div className="flex items-center gap-2">
              <img
                src={userSession.profile_picture}
                className="w-8 rounded-full border-white/30 hover:border-black hover:scale-[118%] transition-all duration-100 ease-out cursor-pointer active:scale-[100%] active:opacity-50 hover:rotate-3 active:-rotate-3"
              />

              <div className="font-bold text-lg">@{userSession.handle}</div>
            </div>
            <div
              className="w-full flex justify-end"
              onClick={() => {
                toastInstance.dismiss()
                toast({
                  title: "Disconnected!",
                  description: "Please come back soon!",
                })
                router.push("/")
              }}
            >
              <DisconnectWalletButton />
            </div>
          </div>
        ),
      })
    } else {
      router.push("/profile")
    }
  }

  if (isFetchingSession)
    return (
      <div className="w-full flex flex-row items-center text-right justify-end">
        <div>
          <LoadingIndicator />
        </div>
      </div>
    )
  if (!userSession) return null

  return (
    <div onClick={handleClick}>
      <img
        src={userSession.profile_picture}
        className="w-10 rounded-full border-2 border-white/30 hover:border-black hover:scale-[118%] transition-all duration-100 ease-out cursor-pointer active:scale-[100%] active:opacity-50 hover:rotate-3 active:-rotate-3"
      />
    </div>
  )
}

export default LoggedInUserButton
