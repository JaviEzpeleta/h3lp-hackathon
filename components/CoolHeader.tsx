"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import UserMenu from "./UserMenu"

const CoolHeader = () => {
  return (
    <div>
      <div className="fixed top-0 w-full overflow-hidden select-none z-40">
        <div className="fixed top-0 left-0 text-white text-xl z-50 w-full">
          <div className="max-w-7xl mx-auto w-full flex justify-between py-6 px-2">
            <Link href="/home" className="flex">
              <Button
                variant="ghost"
                className="font-bold text-bbBlack hover:bg-rfGreen/20 backdrop-blur-md hover:text-ttRed transition-all active:opacity-40 text-2xl"
              >
                h3lp
              </Button>
            </Link>
            <UserMenu />
          </div>
        </div>
        <div className="topBarStuff h-32 fixed top-0 w-full z-10"></div>
        <div
          className="text-xl hidden bg-black/20 backdrop-blur-lg md:backdrop-blur-none
         md:bg-transparent sm:text-4xl pt-6 xl:pt-4 xl:text-6xl font-black p-4 md:flex justify-center 
         animateToTheLeft -z-10 w-full transition-all duration-1000"
        >
          h3lp.io 🌱 helping help others help you
        </div>
      </div>
    </div>
  )
}

export default CoolHeader
