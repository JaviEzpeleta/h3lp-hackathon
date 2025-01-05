"use client"

import React, { useEffect } from "react"
import BlurryEntrance from "./BlurryEntrance"
import { CgSpinnerTwo } from "react-icons/cg"

interface ChatLoadingIndicatorProps {
  scrollRef: React.RefObject<HTMLDivElement | null>
}

const ChatLoadingIndicator = ({ scrollRef }: ChatLoadingIndicatorProps) => {
  useEffect(() => {
    // esperar 0.5 segundos antes de forzar scroll para abajo con el ref
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 500)
  }, [])

  return (
    <>
      <div className="w-full">
        <BlurryEntrance delay={0.2}>
          <div className="animate-pulse">
            <CgSpinnerTwo className="animate-spin text-4xl text-indigo-400 dark:text-emerald-400" />
          </div>
        </BlurryEntrance>
      </div>
    </>
  )
}

export default ChatLoadingIndicator
