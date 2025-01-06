import { ProductInList } from "@/lib/types"
import SubTitle from "./SubTitle"
import PriceTag from "./PriceTag"
import Link from "next/link"
import { cleanHandle } from "@/lib/strings"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import BlurryEntrance from "./BlurryEntrance"

const ProductInListComponent = ({
  product,
  index,
}: {
  product: ProductInList
  index: number
}) => {
  const creatorHandle = cleanHandle(product.creator.handle)
  const router = useRouter()
  return (
    <BlurryEntrance delay={index * 0.04}>
      <div
        onClick={() => router.push(`/product/${product.id}`)}
        className="p-4 relative hover:bg-rfGreen/25 hover:scale-[101%] transition-all 
      active:opacity-60 active:scale-[99%] duration-75
      cursor-pointer rounded-lg border-[3px] border-black flex items-center justify-between gap-4"
      >
        <div>
          <div className="w-20 h-20 flex items-center justify-center border-[3px] border-black rounded-md">
            <div
              style={{
                backgroundImage: `url(${product.creator.profile_picture})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="w-full h-full"
            />
          </div>
          <div className="text-xs font-semibold text-center">
            {creatorHandle.slice(0, 10)}
            {creatorHandle.length > 10 && "..."}
          </div>
        </div>

        <div className="flex-1 pr-16">
          <SubTitle>{product.name}</SubTitle>
          <div className="w-full relative h-7">
            <div className="text-sm text-zinc-500 absolute top-0 w-full truncate text-ellipsis">
              {product.description}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PriceTag>
              ${product.price}
              {product.payment_type === "recurring (monthly)" && "/month"}
            </PriceTag>
          </div>
        </div>
        <div className="h-full absolute right-0 w-[80px] flex justify-end p-1 pt-4 pr-2">
          <div className="flex flex-wrap items-start justify-end gap-0">
            {product.inspired_by_publication_ids.map((id, index) => (
              <div key={index}>
                <Link
                  href={`https://hey.xyz/posts/${id}`}
                  target="_blank"
                  className="border border-transparent rounded-md hover:border-black/20 hover:scale-[112%] 
                  transition-all active:scale-95 active:opacity-50 group inline-block"
                >
                  <div
                    className="rounded-md opacity-75 group-hover:opacity-100 p-1 group-active:rotate-[360deg]
             bg-transparent group-hover:bg-white/50 group-hover:rotate-[180deg] transition-all"
                  >
                    <img src="/img/hey-icon.png" className="w-5" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        {/* <div>{idea.product_description}</div> */}
      </div>
    </BlurryEntrance>
  )
}

export default ProductInListComponent
