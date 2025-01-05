"use client"

import { ImageEmbedding } from "@/lib/postgres"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useEffect, useState } from "react"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

const EditModal = ({
  doc,
  onClose,
  onSave,
  modalOn,
}: {
  doc: ImageEmbedding
  onClose: () => void
  onSave: (fullDescription: string) => void
  modalOn: boolean
}) => {
  const [description, setDescription] = useState("")
  const [title, setTitle] = useState("")

  useEffect(() => {
    const descriptionParts = doc.description
      .split(":::")
      .map((part) => part.trim()) as [string, string]
    setTitle(descriptionParts[0])
    setDescription(descriptionParts[1])
  }, [doc])

  return (
    <Dialog open={modalOn} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Image Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <Textarea
            value={description}
            rows={6}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button onClick={() => onSave(title + " ::: " + description)}>
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default EditModal
