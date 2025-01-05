"use client"

import BlurryEntranceFaster from "@/components/BlurryEntranceFaster"
import LoadingComponent from "@/components/LoadingComponent"
import SubTitle from "@/components/SubTitle"
import IdeasList from "@/components/IdeasList"
import axios from "axios"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const IdeasPage = () => {
  const params = useParams()

  const loadedRef = useRef(false)

  const [ideas, setIdeas] = useState([])
  const [fromProfile, setFromProfile] = useState(null)
  const [toProfile, setToProfile] = useState(null)
  const [isSearching, setIsSearching] = useState(true)
  const [showNoIdeas, setShowNoIdeas] = useState(false)

  useEffect(() => {
    const fetchIdeas = async () => {
      console.log("fetching ideas....")

      const res = await axios.post("/api/ideas/get", {
        from: params.fromHandle,
        to: params.handle,
      })

      const data = res.data.data
      console.log("finished")
      console.log(res.data)

      if (!res.data.success || data.length === 0) {
        setIsSearching(false)
        setShowNoIdeas(true)
        return
      }

      const ideas = JSON.parse(data[0].products_and_services)
      setIdeas(ideas)
      setFromProfile(res.data.fromProfile)
      setToProfile(res.data.toProfile)
      setIsSearching(false)
    }

    if (loadedRef.current) return
    loadedRef.current = true
    fetchIdeas()
  }, [params])

  return (
    <div className="flex flex-col items-center justify-center">
      {isSearching && <LoadingComponent />}
      {!isSearching && ideas.length > 0 && (
        <IdeasList
          ideas={ideas}
          fromProfile={fromProfile}
          toProfile={toProfile}
        />
      )}
      {showNoIdeas && (
        <div className="flex flex-col items-center justify-center text-center">
          <BlurryEntranceFaster>
            <SubTitle>
              Oops...
              <br />
              something didn&apos;t go as planned 😿
            </SubTitle>
          </BlurryEntranceFaster>
          <BlurryEntranceFaster delay={0.5}>
            <div className="pt-8 text-lg">
              Please{" "}
              <Link
                href="/home"
                className="text-ttRed hover:underline active:opacity-40"
              >
                go back
              </Link>{" "}
              and try again
            </div>
          </BlurryEntranceFaster>
        </div>
      )}
    </div>
  )
}

export default IdeasPage
