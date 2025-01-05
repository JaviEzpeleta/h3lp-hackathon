import { ConnectKitButton } from "connectkit"
import { Button } from "./ui/button"

export function ConnectWalletButton() {
  console.log(" hello?")

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress }) => {
        return (
          <Button onClick={show}>
            {isConnected ? truncatedAddress : "Connect Wallet"}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}
