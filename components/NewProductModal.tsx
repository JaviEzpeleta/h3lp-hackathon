"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useEffect, useState } from "react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { GeneratedIdea } from "@/lib/types"
import Title from "./Title"
import SubTitle from "./SubTitle"
import MiniTitle from "./MiniTitle"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"

const NewProductModal = ({
  idea,
  onClose,
  onSave,
  modalOn,
}: {
  idea: GeneratedIdea | null
  onClose: () => void
  onSave: (fullDescription: string) => void
  modalOn: boolean
}) => {
  const [description, setDescription] = useState("")
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState<number>(0)

  // useEffect(() => {
  //   const descriptionParts = doc.description
  //     .split(":::")
  //     .map((part) => part.trim()) as [string, string]
  //   setTitle(descriptionParts[0])
  //   setDescription(descriptionParts[1])
  // }, [doc])

  useEffect(() => {
    if (idea) {
      setTitle(idea.product_name)
      setDescription(idea.product_description)
    }
  }, [idea])

  return (
    <Dialog open={modalOn} onOpenChange={onClose}>
      <DialogContent>
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
            className="!text-xl font-bold"
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
            className="!text-base font-semibold"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
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
                className="!text-base font-semibold w-28"
                onChange={(e) => setPrice(e.target.value)}
              />
              <div className="text-sm font-semibold">$GRASS</div>
            </div>
          </div>
          <div className="flex flex-col gap-1 justify-center items-center">
            <RadioGroup defaultValue="option-one">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one" className="text-lg font-semibold">
                  One-time
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two" className="text-lg font-semibold">
                  Recurring (Monthly)
                </Label>
              </div>
            </RadioGroup>{" "}
          </div>
        </div>

        <Button onClick={() => onSave(title + " ::: " + description)}>
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default NewProductModal
