import { useDisconnect, useSignMessage } from "wagmi"
import { Button } from "./ui/button"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

const NotAuthenticated = () => {
  const { toast } = useToast()
  const { signMessage } = useSignMessage()
  const { disconnect } = useDisconnect()
  //   useEffect(() => {
  //     signMessage()
  //   }, [signMessage])ota

  return (
    <div className="flex flex-col gap-2 items-center">
      <Button onClick={() => signMessage({ message: "hello world" })}>
        Sign message
      </Button>
      <Button onClick={() => disconnect()}>Disconnect</Button>
      {/* <Button onClick={signMessage} disabled={isSuccess}>
        {isSuccess ? "Authenticated" : "Sign to Authenticate"}
      </Button>
      {isError && <div className="text-red-500 text-sm">{error?.message}</div>} */}
    </div>
  )
}

export default NotAuthenticated
