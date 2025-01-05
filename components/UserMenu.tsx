import { useAccount } from "wagmi"
import LoadingIndicator from "./LoadingIndicator"
import LoggedInUserButton from "./LoggedInUserButton"
import { ConnectKitButton } from "connectkit"
const UserMenu = () => {
  const { address, isConnecting, isDisconnected } = useAccount()

  if (isConnecting)
    return (
      <div className="">
        <LoadingIndicator />
      </div>
    )
  if (isDisconnected) return <ConnectKitButton />

  if (address) return <LoggedInUserButton />
  else return <ConnectKitButton />
}

export default UserMenu
