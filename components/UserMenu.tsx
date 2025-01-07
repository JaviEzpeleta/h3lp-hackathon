import { useAccount } from "wagmi"
import LoadingIndicator from "./LoadingIndicator"
import LoggedInUserButton from "./LoggedInUserButton"
import { ConnectKitButton } from "connectkit"
import useStore from "@/lib/zustandStore"
const UserMenu = () => {
  // const { address, isConnecting, isDisconnected } = useAccount()
  const { userSession, isFetchingSession } = useStore()
  if (isFetchingSession)
    return (
      <div className="">
        <LoadingIndicator />
      </div>
    )
  if (!userSession) return <ConnectKitButton />

  if (userSession) return <LoggedInUserButton />
  else return <ConnectKitButton />
}

export default UserMenu
