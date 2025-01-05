"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import MegaIntro from "@/components/MegaIntro"
import SignInOrNot from "@/components/SignInOrNot"
import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"

export default function Home() {
  const [randomNumber, setRandomNumber] = useState(0) // Default value

  const loadedRef = useRef(false)
  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    const randomNumber = Math.floor(Math.random() * 10) + 1
    console.log("SETTING RANDOM NUMBEEERRR")

    setRandomNumber(randomNumber)
  }, []) // Run once on client-side mount

  return (
    <div className="">
      <div className="relative">
        {/* Hero Section */}
        <main className="w-full">
          <div className="text-center mb-8">
            {/* {randomNumber ? <MegaIntro randomNumber={randomNumber} /> : null} */}
            <MegaIntro randomNumber={randomNumber} />
          </div>
          <div className="flex justify-center items-center gap-2 pb-12">
            <SignInOrNot />
          </div>
        </main>
      </div>
    </div>
  )
}
