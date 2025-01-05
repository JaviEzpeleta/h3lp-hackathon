"use client"

import SubTitle from "@/components/SubTitle"
import Title from "@/components/Title"
import { Input } from "@/components/ui/input"
import useStore from "@/lib/zustandStore"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LoadingComponent from "../../components/LoadingComponent"

const HomePage = () => {
  const { userSession, isFetchingSession } = useStore()
  const [handle, setHandle] = useState("")

  const router = useRouter()

  useEffect(() => {
    if (!isFetchingSession && !userSession) {
      router.push("/")
    } else if (!isFetchingSession && userSession) {
      setHandle(userSession?.handle.replace("lens/", "") || "")
    }
    console.log("isFetchingSession", isFetchingSession)
    console.log("userSession", userSession)
  }, [userSession, isFetchingSession])

  const submitForm = async () => {
    if (!userSession) return
    const res = await axios.post("/api/search/help", {
      handle,
      fromHandle: userSession.handle,
    })

    console.log(res)
  }

  if (isFetchingSession) {
    return (
      <div>
        <LoadingComponent />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="max-w-xl mx-auto space-y-4 px-2">
        <div>
          <Title>Search for a Lens user</Title>
          <SubTitle>(it can be yourself too!)</SubTitle>
        </div>
        <div className="flex gap-2">
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
        </div>
      </div>
    </div>
  )
}

export default HomePage
