import { useAccount, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"

export function DisconnectWalletButton() {
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    disconnect()
  }

  if (!isConnected) {
    return null
  }

  return <Button onClick={handleClick}>Disconnect</Button>
}
