"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"

interface TrailEmoji {
  x: number
  y: number
  id: number
  stickerURL: string
}

const MegaIntro = ({ randomNumber }: { randomNumber: number }) => {
  const [trail, setTrail] = useState<TrailEmoji[]>([])
  const [lastRender, setLastRender] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const [theNumber, setTheNumber] = useState(randomNumber)

  useEffect(() => {
    setTheNumber(randomNumber)
  }, [randomNumber])

  const stickerURLS = [
    "https://javitoshi.com/smol-stickers/01-star.webp",
    "https://javitoshi.com/smol-stickers/02-red-heart.webp",
    "https://javitoshi.com/smol-stickers/03-trophy.webp",
    "https://javitoshi.com/smol-stickers/04-fire.webp",
    "https://javitoshi.com/smol-stickers/05-gm.webp",
    "https://javitoshi.com/smol-stickers/06-unicorn.webp",
    "https://javitoshi.com/smol-stickers/07-rainbow.webp",
    "https://javitoshi.com/smol-stickers/08-croissant.webp",
    "https://javitoshi.com/smol-stickers/09-rose.webp",
    "https://javitoshi.com/smol-stickers/10-bonsai.webp",
    "https://javitoshi.com/smol-stickers/11-carrot.webp",
    "https://javitoshi.com/smol-stickers/12-heart-cat.webp",
    "https://javitoshi.com/smol-stickers/13-lol.webp",
    "https://javitoshi.com/smol-stickers/14-avocado.webp",
    "https://javitoshi.com/smol-stickers/15-blue-heart.webp",
    "https://javitoshi.com/smol-stickers/16-lol.webp",
    "https://javitoshi.com/smol-stickers/17-crab.webp",
    "https://javitoshi.com/smol-stickers/18-lfg.webp",
    "https://javitoshi.com/smol-stickers/19-web3.webp",
    // "https://javitoshi.com/smol-stickers/20-bonsai.webp",
    // "https://javitoshi.com/smol-stickers/21-dope.webp",
    "https://javitoshi.com/smol-stickers/22-fries.webp",
    // "https://javitoshi.com/smol-stickers/23-yolo.webp",
    // "https://javitoshi.com/smol-stickers/24-wtf.webp",
    "https://javitoshi.com/smol-stickers/25-lfg.webp",
    "https://javitoshi.com/smol-stickers/26-lfg.webp",
    "https://javitoshi.com/smol-stickers/27-fire.webp",
    // "https://javitoshi.com/smol-stickers/28-lens.webp",
    "https://javitoshi.com/smol-stickers/2025-b.webp",
    "https://javitoshi.com/smol-stickers/2025-bonsai.webp",
    "https://javitoshi.com/smol-stickers/2025.webp",
    "https://javitoshi.com/smol-stickers/h3lp-2.webp",
    "https://javitoshi.com/smol-stickers/h3lp.webp",
    "https://javitoshi.com/smol-stickers/mail-sticker.webp",
  ]

  const emojis = ["✨", "💫", "⭐", "🌟", "💚", "🌱", "🌿", "🌳", "💵"] // customize these!

  const DISTANCE_BETWEEN_EMOJIS = 80
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return
      const now = Date.now()
      if (now - lastRender < DISTANCE_BETWEEN_EMOJIS) return

      const newEmoji: TrailEmoji = {
        x: e.clientX,
        y: e.clientY,
        id: now,
        stickerURL: stickerURLS[Math.floor(Math.random() * stickerURLS.length)],
      }

      setTrail((prev) => [...prev, newEmoji].slice(-30))
      setLastRender(now)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [lastRender, isHovering])

  return (
    <div
      className="min-h-[520px] rounded-xl mb-4 relative flex flex-col w-full py-24 select-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setTrail([])
      }}
    >
      <div
        className="max-w-xl cursor-pointer w-full !overflow-hidden relative rounded-2xl select-none
      mx-auto h-full flex-1 flex items-center justify-center border-4 shadow-md hover:shadow-lg flex-col
      shadow-black/30 hover:shadow-black/40 transition-all ease-out group"
        onClick={() => {
          setTheNumber(Math.floor(Math.random() * 28) + 1)
        }}
      >
        {theNumber ? (
          // <div className="slowlyGrowImage inline-block">
          <div className="slowlyGrowImage absolute">
            <img
              draggable={false}
              className="select-none opacity-90 group-hover:opacity-100  group-active:opacity-50
            group-hover:contrast-[110%] group-hover:brightness-[110%] transition-all duration-1000 ease-out
            min-w-[500px] scale-[110%] max-w-[650px] group-hover:scale-[115%]"
              src={`/img/hero/${theNumber}.webp`}
              // src="/img/light-mode-lens.png"
              alt="smol lens logo"
            />
          </div>
        ) : // </div>
        null}
        {trail.map(({ x, y, id, stickerURL }) => (
          <motion.div
            key={id}
            initial={{ opacity: 1, scale: 1, rotate: 0 }}
            animate={{ opacity: 0, scale: 0, rotate: 360 }}
            transition={{
              duration: 1.2,
              rotate: { duration: 8.2, ease: "linear" },
            }}
            className="pointer-events-none fixed text-2xl z-10"
            style={{ left: x - 80, top: y - 80 }}
          >
            <img src={stickerURL} alt="sticker" width={160} height={160} />
          </motion.div>
        ))}

        {/* <LensDecorations /> */}

        <div className="flex select-none items-center gap-4 text-11xl font-black z-10 text-shadow-like-border2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.4,
            }}
            className="text-white select-none"
          >
            <div className="select-none">H3lp</div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 2,
          }}
          className="text-white select-none z-10"
        >
          <div className="select-none font-bold w-full translate-y-6 text-xl md:text-2xl text-shadow-like-border12">
            Helping you help others who can help you
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MegaIntro
