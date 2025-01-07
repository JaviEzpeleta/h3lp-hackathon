"use client"

import { getRecentProducts } from "@/lib/postgres"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import LoadingComponent from "./LoadingComponent"
import LoadingIndicator from "./LoadingIndicator"
import ProductInList from "./ProductInList"
import ProductInListComponent from "./ProductInList"
import BigTitle from "./BigTitle"
import Title from "./Title"

const RecentProducts = () => {
  //   const products = await getRecentProducts()
  //   console.log("products")
  //   console.log(products)

  const loadedRef = useRef(false)
  const [recentProducts, setRecentProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.post("/api/products/recent")
      const data = res.data
      if (data.success) {
        setRecentProducts(data.data)
      }
      setIsLoading(false)
    }
    if (!loadedRef.current) {
      loadedRef.current = true
      fetchProducts()
    }
  }, [])

  if (isLoading)
    return (
      <div className="w-full flex justify-center bg-zinc-200/30 rounded-lg py-1 text-center">
        <LoadingIndicator />
      </div>
    )

  if (recentProducts.length === 0) return <></>

  return (
    <div className="space-y-4">
      <Title>Recent Products</Title>
      <div className="space-y-4">
        {recentProducts.map((product, index) => (
          <ProductInListComponent product={product} key={index} index={index} />
        ))}
      </div>
    </div>
  )
}

export default RecentProducts
