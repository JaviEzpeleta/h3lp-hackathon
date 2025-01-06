"use client"

import SubTitle from "@/components/SubTitle"
import RecentProducts from "@/components/RecentProducts"
import Title from "@/components/Title"
import useStore from "@/lib/zustandStore"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LoadingComponent from "../../components/LoadingComponent"
import { AnimatePresence, motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

const HomePage = () => {
  const { userSession, isFetchingSession } = useStore()
  const [handle, setHandle] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!isFetchingSession && !userSession) {
      router.push("/")
    } else if (!isFetchingSession && userSession) {
      setHandle(userSession?.handle.replace("lens/", "") || "")
    }
  }, [userSession, isFetchingSession])

  const submitForm = async () => {
    if (!userSession) return
    setIsSearching(true)

    const res = await axios.post("/api/search/help", {
      handle,
      targetHandle: userSession.handle,
    })
    if (res.data.success) {
      const cleanHandle = res.data.data.handle.replace("lens/", "")
      const cleanTargetHandle = res.data.data.targetHandle.replace("lens/", "")
      router.push(`/ideas/${cleanHandle}/${cleanTargetHandle}`)
    } else {
      toast({
        title: "Oooooops!!! No ideas found...",
        description: "Try again with a different handle, sorry!",
      })
    }

    setIsSearching(false)
  }

  if (isFetchingSession) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingComponent />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto pt-40">
      <div className="max-w-xl mx-auto space-y-4 px-2">
        <div className="flex flex-col items-center text-center justify-center gap-1">
          <Title>Search for a Lens user</Title>
          <div className="opacity-70">
            <SubTitle>(it can be yourself too!)</SubTitle>
          </div>
        </div>
        <AnimatePresence>
          {!isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              layout
              className="flex gap-2 items-center h-20"
            >
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="!text-3xl !font-bold w-80 h-16 rounded-xl bg-white border-2 focus:border-rfGreen active:border-rfGreen active:bg-rfGreen/15 focus:bg-rfGreen/15 active:outline-none active:ring-0 focus:outline-none focus:ring-0 border-black py-1 px-4"
              />

              <button
                onClick={submitForm}
                className="text-base lg:text-xl font-bold w-60 h-16 rounded-xl 
            border-4 border-black py-1 px-4 bg-indigo-200 hover:bg-indigo-300 active:opacity-60 transition-all ease-out"
              >
                Find ways to help
              </button>
            </motion.div>
          )}
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              layout
              className="px-4 h-20 flex justify-center items-center bg-indigo-200 rounded-xl"
            >
              <LoadingComponent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="max-w-3xl px-2 py-24 mx-auto">
        <RecentProducts />
      </div>
    </div>
  )
}

export default HomePage
