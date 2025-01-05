"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const AnimatedStar = ({ onClick }: { onClick: () => void }) => {
  const [isHovering, setIsHovering] = useState(false)
  return (
    <div
      className="w-full h-full border bg-yellow-100 flex items-center justify-center cursor-pointer active:scale-[88%] transition-all duration-100 active:opacity-60"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
    >
      <AnimatePresence>
        {isHovering && (
          <motion.img
            src="https://javitoshi.com/smol-stickers/01-star.webp"
            className="w-full h-full"
            initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1.5 }}
            exit={{
              opacity: 0,
              rotate: 135,
              scale: 0.5,
              filter: "blur(4px)",
              transition: { duration: 0.5 },
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default AnimatedStar
