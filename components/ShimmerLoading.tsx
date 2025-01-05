"use client"

import { motion } from "framer-motion"

const ShimmerLoading = ({ text }: { text: string }) => {
  return (
    <div className="">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.2, 1.2, 1],
            opacity: [1, 0.5, 0.5, 1],
            filter: ["blur(0px)", "blur(1px)", "blur(1px)", "blur(0px)"],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.1, // cada letra empieza 0.1s después que la anterior
            ease: "easeInOut",
          }}
          className="inline-block font-bold text-3xl font-sans antialiased"
        >
          {char}
        </motion.span>
      ))}
    </div>
  )
}

export default ShimmerLoading
