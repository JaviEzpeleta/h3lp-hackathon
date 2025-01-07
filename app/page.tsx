"use client"

import HeroBanner from "@/components/HeroBanner"
import SignInOrNot from "@/components/SignInOrNot"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"
import { useRef } from "react"
import { useState } from "react"

export default function Home() {
  const [randomNumber, setRandomNumber] = useState(0)

  const loadedRef = useRef(false)
  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    const randomNumber = Math.floor(Math.random() * 28) + 1
    setRandomNumber(randomNumber)
  }, [])

  return (
    <div className="">
      <div className="relative">
        {/* Hero Section */}
        <main className="w-full">
          <div className="text-center mb-8">
            {/* {randomNumber ? <HeroBanner randomNumber={randomNumber} /> : null} */}
            <HeroBanner randomNumber={randomNumber} />
          </div>
          <div className="flex justify-center items-center gap-2 pb-12">
            <SignInOrNot />
          </div>

          <div className="flex justify-center items-center gap-2 pb-12">
            <Link
              href="https://javitoshi.com/videos/h3lp-demo-video.mp4"
              target="_blank"
            >
              <Button variant="outline" size="xl">
                📼 Watch the demo video
              </Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
