"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useEffect, useState } from "react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { GeneratedIdea, LensSavedProfile } from "@/lib/types"
import Title from "./Title"
import SubTitle from "./SubTitle"
import MiniTitle from "./MiniTitle"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import useStore from "@/lib/zustandStore"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import LoadingComponent from "@/components/LoadingComponent"
import BlurryEntranceFaster from "./BlurryEntranceFaster"
import Link from "next/link"

const NewProductModal = ({
  idea,
  onClose,
  onSave,
  modalOn,
  creatorProfile,
  targetProfile,
}: {
  idea: GeneratedIdea | null
  onClose: () => void
  onSave: (fullDescription: string) => void
  modalOn: boolean
  creatorProfile: LensSavedProfile
  targetProfile: LensSavedProfile
}) => {
  const [isCreating, setIsCreating] = useState(false)
  const [description, setDescription] = useState("")
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [productCreated, setProductCreated] = useState<number | null>(null)

  const { userSession } = useStore()

  const { toast } = useToast()

  const submittingTheNewProduct = async () => {
    if (!idea) return
    if (!userSession) return

    if (price <= 0) {
      toast({
        title: "Oops, the price!",
        description: "Please put a price greater than $0",
        variant: "destructive",
      })
      return false
    }

    setIsCreating(true)

    const product = {
      name: title,
      description: description,
      price: price,
      deadline: idea.product_deadline,
      created_by: creatorProfile.address,
      inspired_by_publication_ids: idea.inspired_by_publication_ids,
      offered_by: creatorProfile.handle,
      targeted_to: targetProfile.handle,
    }

    console.log(" 📁  product")
    console.log(product)
    // console.log(" 📁  idea")
    // console.log(idea)

    // return false
    const response = await axios.post("/api/create-product", product)
    // console.log(" 📁  response")
    // console.log(response)
    // console.log(" 📁  response.data")
    // console.log(response.data)

    const productId = response.data.data

    setProductCreated(productId)
    setIsCreating(false)
  }

  useEffect(() => {
    if (idea) {
      setTitle(idea.product_name)
      setDescription(idea.product_description)
      setPrice(idea.product_price)
    }
  }, [idea])

  const onCloseEvent = () => {
    if (isCreating) return
    setProductCreated(null)
    onClose()
  }

  return (
    <Dialog open={modalOn} onOpenChange={onCloseEvent}>
      <DialogContent
        className={`selection:bg-black/60 max-w-4xl selection:text-rfGreen ${
          isCreating ? "[&>button]:hidden" : ""
        }`}
      >
        <>
          {productCreated ? (
            <DialogHeader>
              <DialogTitle>
                <BlurryEntranceFaster>
                  <Title>Product Created!!</Title>
                  <div className="pt-8">
                    <SubTitle>LFG 🫡</SubTitle>
                  </div>
                </BlurryEntranceFaster>
                <BlurryEntranceFaster delay={0.3}>
                  <div className="flex flex-col md:flex-row items-center gap-2 pt-14">
                    <Link href={`/product/${productCreated}`}>
                      <Button size="xl">Go to the product page</Button>
                    </Link>
                    <Button
                      size="xl"
                      variant="outline"
                      onClick={() => {
                        setProductCreated(null)
                        onClose()
                      }}
                    >
                      Create more products
                    </Button>
                  </div>
                </BlurryEntranceFaster>
              </DialogTitle>
            </DialogHeader>
          ) : (
            <>
              {isCreating ? (
                <DialogHeader>
                  <DialogTitle>
                    <div className="flex justify-center items-center h-80">
                      <LoadingComponent text="Creating the product..." />
                    </div>
                  </DialogTitle>
                </DialogHeader>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>
                      <Title>Create a new product</Title>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col gap-1">
                    <Label>
                      <div className="opacity-70">
                        <MiniTitle>Title</MiniTitle>
                      </div>
                    </Label>
                    <Input
                      className="!text-xl lg:!text-2xl font-bold"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>
                      <div className="opacity-70">
                        <MiniTitle>Description</MiniTitle>
                      </div>
                    </Label>
                    <Textarea
                      value={description}
                      rows={5}
                      className="!text-base lg:!text-xl font-semibold"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between max-w-xl gap-6 w-full mx-auto">
                    <div className="flex flex-col gap-1">
                      <Label>
                        <div className="opacity-70">
                          <MiniTitle>Price</MiniTitle>
                        </div>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={price}
                          min={0}
                          step={0.01}
                          className="!text-base font-semibold w-32"
                          onChange={(e) => setPrice(Number(e.target.value))}
                        />
                        <div className="text-sm font-semibold">$GRASS</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-center">
                      <RadioGroup defaultValue="option-one">
                        <div className="flex items-center space-x-2 active:opacity-60">
                          <RadioGroupItem value="option-one" id="option-one" />
                          <Label
                            htmlFor="option-one"
                            className="text-base font-semibold cursor-pointer"
                          >
                            One-time
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 active:opacity-60">
                          <RadioGroupItem value="option-two" id="option-two" />
                          <Label
                            htmlFor="option-two"
                            className="text-base font-semibold cursor-pointer"
                          >
                            Recurring (Monthly)
                          </Label>
                        </div>
                      </RadioGroup>{" "}
                    </div>
                  </div>

                  <div className="max-w-xl mx-auto w-full flex flex-col pt-6">
                    <Button
                      onClick={submittingTheNewProduct}
                      className="rounded-full"
                      size="xl"
                    >
                      Create this product!
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </>
      </DialogContent>
    </Dialog>
  )
}

export default NewProductModal
