"use client"

import BlurryEntranceFaster from "@/components/BlurryEntranceFaster"
import LoadingComponent from "@/components/LoadingComponent"
import SubTitle from "@/components/SubTitle"
import IdeasList from "@/components/IdeasList"
import axios from "axios"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const IdeasPage = () => {
  const params = useParams()

  const loadedRef = useRef(false)

  const [ideas, setIdeas] = useState([])
  const [creatorProfile, setCreatorProfile] = useState(null)
  const [targetProfile, setTargetProfile] = useState(null)
  const [isSearching, setIsSearching] = useState(true)
  const [showNoIdeas, setShowNoIdeas] = useState(false)

  useEffect(() => {
    const fetchIdeas = async () => {
      console.log("fetching ideas....")

      const res = await axios.post("/api/ideas/get", {
        creator: params.fromHandle,
        target: params.handle,
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
      setCreatorProfile(res.data.creatorProfile)
      setTargetProfile(res.data.targetProfile)
      setIsSearching(false)
    }

    if (loadedRef.current) return
    loadedRef.current = true
    fetchIdeas()
  }, [params])

  return (
    <div className="flex flex-col items-center justify-center pt-28 md:pt-40">
      {isSearching && (
        <div className="py-48">
          <LoadingComponent />
        </div>
      )}
      {creatorProfile && targetProfile && !isSearching && ideas.length > 0 && (
        <IdeasList
          ideas={ideas}
          creatorProfile={creatorProfile}
          targetProfile={targetProfile}
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
