"use client"
import { motion } from "framer-motion"
import ShimmerLoading from "./ShimmerLoading"

const LoadingComponent = () => {
  return (
    <motion.div
      className=""
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      <ShimmerLoading text="loading..." />
    </motion.div>
  )
}

export default LoadingComponent
