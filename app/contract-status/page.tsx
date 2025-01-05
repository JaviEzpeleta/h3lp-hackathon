import { getContractBalance } from "@/lib/walletActions"
import { ethers } from "ethers"
import Link from "next/link"
import { BLOCK_EXPLORER_URL, DONATIONS_CONTRACT_ADDRESS } from "@/lib/constants"

const DonatePage = async () => {
  const balance = await getContractBalance()
  // parse eth because balance has so many decimals
  const balanceInEth = ethers.formatEther(balance)

  return (
    <div className="text-white p-8 pt-32 space-y-4 max-w-5xl mx-auto">
      {/* <div className="text-2xl font-bold">HOLDINGS PAGE</div> */}
      <div className="flex">
        <Link
          href={`${BLOCK_EXPLORER_URL}/address/${DONATIONS_CONTRACT_ADDRESS}`}
          target="_blank"
          className="p-4 rounded-xl bg-zinc-900/80 text-zinc-300 
         hover:text-white hover:z-0 hover:scale-[104%] transition-all duration-100 ease-out active:scale-100 active:opacity-60"
        >
          <div>Contract&apos;s balance:</div>
          <div className="text-4xl font-bold">
            {balanceInEth.toString()}
            <span className="text-base pl-1 font-medium">$GRASS</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default DonatePage
