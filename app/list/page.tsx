import { getAllProducts } from "@/lib/postgres"
import { Product } from "@/lib/types"
import Link from "next/link"

const List = async () => {
  const products = (await getAllProducts()) as Product[]

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto w-full py-32">
      <h1 className="text-2xl font-bold">List</h1>
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/product/${product.id}`}
          className="flex flex-col gap-2 p-4 bg-slate-800/50 rounded-md hover:bg-slate-700/80 
          active:opacity-50 transition-all ease-out"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <div className="bg-yellow-700/50 rounded-md p-1.5 px-3">
              <p className="text-sm text-yellow-300">{product.price} $GRASS</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-500">Description</label>
            <p className="text-sm text-slate-300">{product.description}</p>
            {/* <label className="text-sm text-slate-500">Price</label> */}
            {/* <label className="text-sm text-slate-500">Deadline</label>
            <p className="text-sm text-slate-300">{product.deadline}</p> */}
            {/* <label className="text-sm text-slate-500">Address</label>
            <p className="text-sm text-slate-300">{product.address}</p> */}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default List
