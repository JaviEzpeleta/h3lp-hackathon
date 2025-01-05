"use client"

import { motion } from "framer-motion"

const LensDecorations = () => {
  const randomYBegin = Math.random() * 100
  const randomXBegin = Math.random() * 400
  const randomYEnd = randomYBegin + Math.random() * 100
  const randomXEnd = randomXBegin + Math.random() * 400

  return (
    <motion.div
      initial={{ opacity: 0, y: randomYBegin, x: randomXBegin }}
      animate={{ opacity: 1, y: randomYEnd, x: randomXEnd }}
      className="absolute top-0 left-0 text-2xl"
    >
      🌱
    </motion.div>
  )
}

export default LensDecorations
