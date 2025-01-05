"use client"

import { Button } from "@/components/ui/button"
import { DragEvent, useState } from "react"
import { PiSpinnerBallDuotone } from "react-icons/pi"
import BlurryEntrance from "./BlurryEntrance"
import BlurryEntranceFaster from "./BlurryEntranceFaster"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useAccount } from "wagmi"
import { Input } from "./ui/input"
import { Label } from "@radix-ui/react-label"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"

const UploadProductFileModule = () => {
  const [files, setFiles] = useState<File[]>([])
  const { toast } = useToast()

  const { address } = useAccount()

  const [name, setName] = useState("testing product")
  const [description, setDescription] = useState("testing description")
  const [price, setPrice] = useState("100")
  const [deadline, setDeadline] = useState<number | null>(null)

  const escrowOptions = [
    { label: "1 minute (for testing)", seconds: 60 },
    { label: "1 day", seconds: 86400 },
    { label: "1 month", seconds: 2592000 },
  ]

  const [isLoading, setIsLoading] = useState(false)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles])
  }

  const [uploadedUrls, setUploadedUrls] = useState<any[]>([])

  const [handle, setHandle] = useState("")

  const handleSubmit = async () => {
    try {
      if (!deadline) {
        console.log("paso 2.0")
        console.log("Showing toas...??/")
        toast({
          title: "Please select a deadline",
          variant: "destructive",
        })
        console.log("paso 2.0.1")
        return
      }

      console.log("paso 2.1")

      if (!price) {
        toast({
          title: "Please enter a price",
          variant: "destructive",
        })
        return
      }

      console.log("paso 2.2")

      if (name.length < 3 || description.length < 3) {
        toast({
          title: "Please enter a valid name and description",
          variant: "destructive",
        })
        return
      }

      console.log("paso 2.3")

      const product = {
        name,
        description,
        price,
        deadline,
        created_by: address,
      }

      const response = await axios.post("/api/create-product", product)

      console.log(" 📁  uploaded URLs:", response)
    } catch (error) {
      console.error("Upload error:", error)
      // Aquí deberías mostrar un error al usuario
    } finally {
      setIsLoading(false)
    }
  }

  // const handleSubmit = async () => {
  //   console.log("paso 1")

  //   if (files.length === 0) return

  //   console.log("paso 2")
  //   try {
  //     if (!deadline) {
  //       console.log("paso 2.0")
  //       console.log("Showing toas...??/")
  //       toast({
  //         title: "Please select a deadline",
  //         variant: "destructive",
  //       })
  //       console.log("paso 2.0.1")
  //       return
  //     }

  //     console.log("paso 2.1")

  //     if (!price) {
  //       toast({
  //         title: "Please enter a price",
  //         variant: "destructive",
  //       })
  //       return
  //     }

  //     console.log("paso 2.2")

  //     if (name.length < 3 || description.length < 3) {
  //       toast({
  //         title: "Please enter a valid name and description",
  //         variant: "destructive",
  //       })
  //       return
  //     }

  //     console.log("paso 2.3")

  //     const product = {
  //       name,
  //       description,
  //       price,
  //       deadline,
  //       created_by: address,
  //     }
  //     console.log("paso 3")

  //     console.log("product")
  //     console.log(product)

  //     setIsLoading(true)

  //     const formData = new FormData()

  //     files.forEach((file) => {
  //       formData.append("files", file)
  //     })

  //     formData.append("product", JSON.stringify(product))

  //     const response = await fetch("/api/product/create", {
  //       method: "POST",
  //       body: formData,
  //     })

  //     if (!response.ok) {
  //       throw new Error("Upload failed")
  //     }

  //     // grab de uploaded URLS:
  //     const res = await response.json()
  //     console.log(" 📁  uploaded URLs:", res)
  //     const { objectsStored } = res
  //     setUploadedUrls(objectsStored)
  //     setFiles([]) // Clear files after successful upload
  //   } catch (error) {
  //     console.error("Upload error:", error)
  //     // Aquí deberías mostrar un error al usuario
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const randomize = async () => {
    const res = await axios.post("/api/form/randomize")
    const product = res.data.data
    setName(product.product_name)
    setDescription(product.product_description)
    setPrice((product.product_price / 1000).toFixed(3)) // random value from 0.1 to 0.44
    setDeadline(product.product_deadline) // random value from 1 minute to 1 month
  }

  const readPosts = async () => {
    const res = await axios.post("/api/form/read-posts", { handle })
    console.log(" 📁  readPosts:", res)
  }

  return (
    <>
      <BlurryEntranceFaster>
        <h1 className="text-2xl font-bold mb-4">Create New Product</h1>

        <div className="flex gap-2">
          <Input value={handle} onChange={(e) => setHandle(e.target.value)} />
          <Button onClick={readPosts}>Read posts</Button>
          {/* <Button onClick={randomize}>Randomize</Button> */}
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <p className="text-sm text-gray-500 mb-2">
              Enter a clear, descriptive name for your product listing
            </p>
            <Input
              id="name"
              placeholder="Enter product name"
              value={name}
              disabled={isLoading}
              className="bg-slate-950/50 active:bg-black focus:bg-black !border-black"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <p className="text-sm text-gray-500 mb-2">
              Provide detailed information about your product
            </p>
            <textarea
              id="description"
              placeholder="Enter product description"
              value={description}
              disabled={isLoading}
              className="w-full min-h-[100px] rounded-md bg-slate-950/50 active:bg-black focus:bg-black border border-black text-sm p-2 px-3"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="price">Price (in $GHO)</Label>
            <p className="text-sm text-gray-500 mb-2">
              Set the price in $GHO. This is the amount the buyer will need to
              deposit
            </p>
            <Input
              id="price"
              type="number"
              placeholder="0"
              step="0.001"
              min="0"
              // ! disable scroll wheel
              onWheel={(e) => e.preventDefault()}
              value={price}
              disabled={isLoading}
              className="bg-slate-950/50 active:bg-black focus:bg-black !border-black"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="deadline">Escrow Duration</Label>
            <p className="text-sm text-gray-500 mb-2">
              Select the time period for which funds will be held in escrow
              before automatic release
            </p>
            <div className="flex gap-2 mt-2">
              {escrowOptions.map((option) => (
                <Button
                  key={option.label}
                  type="button"
                  className="min-w-28"
                  disabled={isLoading}
                  variant={
                    deadline === option.seconds ? "default" : "secondary"
                  }
                  onClick={() => setDeadline(option.seconds)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* <div className="flex flex-col gap-6 h-full min-w-80 py-2">
            {!isLoading && (
              <div
                className="p-4 border border-dashed border-accent/70 rounded-lg min-h-[320px] flex flex-col items-center justify-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                // onClick, fakes the open file dialog
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.multiple = true
                  input.onchange = (e: any) => {
                    const newFiles = e.target.files
                    setFiles((prevFiles) => [...prevFiles, ...newFiles])
                  }
                  input.click()
                }}
              >
                {files.length === 0 ? (
                  <div className="text-center text-accent/80 select-none">
                    <div className="text-balance">
                      Drop the product files here
                    </div>
                  </div>
                ) : (
                  <>
                    <p>
                      {files.length > 1 ? `${files.length} files ` : "1 file "}
                      to upload
                    </p>

                    <AnimatePresence>
                      <div className="mt-2 flex flex-wrap gap-2 items-center justify-center">
                        {files.map((file, index) => (
                          <motion.div
                            layout
                            key={index}
                            initial={{
                              opacity: 0,
                              y: 20,
                              filter: "blur(10px)",
                            }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ delay: index * 0.015 }}
                          >
                            <div className="relative">
                              <div className="absolute top-0.5 right-0.5">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="p-1"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setFiles((prevFiles) =>
                                      prevFiles.filter((_, i) => i !== index)
                                    )
                                    e.preventDefault()
                                    return false
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            

                              <img
                                src={URL.createObjectURL(file)}
                                className="h-32 rounded-md border border-black shadow-sm shadow-black"
                                // className="w-32 h-32 object-cover rounded-md border border-black shadow-sm shadow-black"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>
                  </>
                )}
              </div>
            )}

            {isLoading && (
              <div className="p-4 w-full flex justify-center items-center">
                <div className="flex flex-col gap-2 items-center justify-center">
                  <BlurryEntrance>
                    <div className="animate-spin">
                      <PiSpinnerBallDuotone />
                    </div>
                  </BlurryEntrance>
                  <div>Processing...</div>
                </div>
              </div>
            )}

           
          </div> */}
          {/* {files.length > 0 && ( */}
          <div className="flex justify-center">
            <BlurryEntranceFaster>
              <Button
                size="lg"
                onClick={handleSubmit}
                // disabled={files.length === 0}
              >
                Create Product
              </Button>
            </BlurryEntranceFaster>
          </div>
          {/* )} */}
        </div>
      </BlurryEntranceFaster>
      {uploadedUrls.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {uploadedUrls.map(
            (
              { url, description }: { url: string; description: string },
              index
            ) => (
              <div key={index}>
                <img
                  src={url}
                  className="w-32 h-32 rounded-md border border-black shadow-sm shadow-black object-cover"
                />
                <div>{description}</div>
              </div>
            )
          )}
        </div>
      )}
    </>
  )
}

export default UploadProductFileModule
