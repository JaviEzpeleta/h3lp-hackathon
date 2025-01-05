import * as React from "react"
import {
  type BaseError,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
  useAccount,
  useBalance,
} from "wagmi"
import { parseEther, formatUnits } from "viem"
import { erc20Abi } from "viem"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { BONSAI_TOKEN_ADDRESS, LENS_RECEIVER_ADDRESS } from "@/lib/constants"
import { ConnectKitButton } from "connectkit"
import NumberFlow from "@number-flow/react"
import axios from "axios"
import { useEffect } from "react"

// Bonsai token en Polygon

// Add the contract ABI
const donationsAbi = [
  {
    inputs: [],
    name: "donate",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const

export function SendTransaction({
  grassPrice,
  date,
}: {
  grassPrice: number
  date: string
}) {
  const { address } = useAccount()
  const [amount, setAmount] = React.useState<number>(0.1)

  const { data: hash, error, isPending, writeContract } = useWriteContract()
  const { data: balance } = useBalance({
    address: address,
  })

  const formattedBalance = balance ? Number(formatUnits(balance.value, 18)) : 0
  const balanceUSD = (formattedBalance * grassPrice).toFixed(2)
  console.log("🟢 🟢 🟢 🟢 Got balanceUSD:", balanceUSD)

  const setGrassAmount = (usdAmount: number) => {
    const grassAmount = usdAmount / grassPrice
    setAmount(grassAmount)
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const amount = formData.get("value") as string

    const amountCropped = Number(amount).toFixed(2)

    console.log("🟢 🟢 🟢 🟢 Submitting donation", amountCropped)

    // Convert amount to wei (18 decimals)
    const value = parseEther(amountCropped)

    writeContract({
      address: "0x7D58E6c2DeC0C2777b90d8A64506b3d828ee8568", // Donations contract address
      abi: donationsAbi,
      functionName: "donate",
      value: value, // This sends ETH with the transaction
    })

    console.log("🟢 🟢 🟢 🟢 Submitted donation")
  }

  useEffect(() => {
    if (hash) {
      const amountCropped = Number(amount).toFixed(2)
      axios.post("/api/save-donation-attempt", {
        addressFrom: address,
        amount: amountCropped,
        txHash: hash,
        date,
      })
    }
  }, [hash])

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  if (!address) {
    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Send $GRASS</CardTitle>
          <CardDescription>Please connect your wallet first</CardDescription>
          <ConnectKitButton />
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>
          <div className="text-4xl">Donate $GRASS</div>
        </CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          {/* <div className="space-y-2">
            <Label htmlFor="address">Recipient Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="0xA0Cf…251e"
              required
              className="font-mono"
            />
          </div> */}

          <div className="space-y-2">
            <div>
              You have{" "}
              {Number(formattedBalance.toFixed(2)) % 1 === 0
                ? Number(formattedBalance.toFixed(0)).toLocaleString()
                : Number(formattedBalance.toFixed(2)).toLocaleString()}{" "}
              GRASS{" "}
              <span className="text-sm opacity-60">(${balanceUSD} USD)</span>
            </div>

            {/* <Label htmlFor="value">Amount ($GRASS)</Label> */}
            <div className="space-y-2">
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setGrassAmount(1)}
                >
                  $1 USD
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setGrassAmount(2)}
                >
                  $2 USD
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setGrassAmount(5)}
                >
                  $5 USD
                </Button>
              </div>
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute left-3 top-0 h-full flex items-center justify-center">
                    <img
                      src="https://javitoshi.com/smol-stickers/20-bonsai.png"
                      className="w-12"
                    />
                  </div>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.1"
                    required
                    className="font-mono !text-6xl h-24 !pl-16"
                    value={
                      Number(amount.toFixed(2)) % 1 === 0
                        ? amount.toFixed(0)
                        : amount.toFixed(2)
                    }
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  ≈$
                  <NumberFlow
                    value={
                      Number((grassPrice * amount).toFixed(2)) % 1 === 0
                        ? Number((grassPrice * Number(amount)).toFixed(0))
                        : Number((grassPrice * Number(amount)).toFixed(2))
                    }
                  />{" "}
                  USD
                </p>
              </div>
            </div>
          </div>

          <Button
            disabled={isPending || isConfirming}
            type="submit"
            className="w-full"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isPending ? "Confirming..." : "Waiting for confirmation..."}
              </>
            ) : (
              "Send $GRASS Donation"
            )}
          </Button>

          {hash && (
            <Alert>
              <AlertDescription className="font-mono break-all">
                Transaction Hash: {hash}
              </AlertDescription>
            </Alert>
          )}

          {isConfirmed && (
            <Alert>
              <AlertDescription>
                Transaction confirmed successfully!
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {(error as BaseError).shortMessage || error.message}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
