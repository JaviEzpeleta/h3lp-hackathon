import { useEffect } from "react"
import { LoginOptions } from "./LoginOptions"

export function LoginOptionsWrapper({
  wallet,
  onSuccess,
  open,
  setOpen,
}: {
  wallet: string
  onSuccess: () => void
  open: boolean
  setOpen: (open: boolean) => void
}) {
  useEffect(() => {
    setTimeout(() => {
      setOpen(true)
    }, 1000)
  }, [])

  return (
    <LoginOptions
      wallet={wallet}
      onSuccess={onSuccess}
      open={open}
      onOpenChange={() => {
        console.log("onOpenChange")
        setOpen(false)
      }}
    />
  )
}
