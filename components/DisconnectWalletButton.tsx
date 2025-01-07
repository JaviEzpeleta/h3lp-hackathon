import { useAccount, useDisconnect } from "wagmi"
import { Button } from "@/components/ui/button"
import useStore from "@/lib/zustandStore"

export function DisconnectWalletButton() {
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { setUserSession } = useStore()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    disconnect()
    setUserSession(null)
  }

  if (!isConnected) {
    return null
  }

  return <Button onClick={handleClick}>Disconnect</Button>
}
