"use client"

import axios from "axios"
import { useEffect, useRef, useState } from "react"

const MiniAddressPill = ({ address }: { address: string }) => {
  const [profileInfo, setProfileInfo] = useState<any>(null)

  const loadedRef = useRef(false)
  useEffect(() => {
    const fetchProfileInfo = async () => {
      if (loadedRef.current) return
      loadedRef.current = true

      const res = await axios.post("/api/get-profile-by-address", { address })
      const profileFetched = res.data.data
      console.log("🟢 profileFetched", profileFetched)

      setProfileInfo(profileFetched)
    }

    fetchProfileInfo()
  }, [address])
  if (!profileInfo)
    return <div className="text-xs text-zinc-300">{address}</div>

  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          backgroundImage: `url(${profileInfo.profile_picture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-8 h-8 rounded-full"
      />
      {/* <div>{profileInfo.profilePicture}</div> */}
      <div>
        <div className="text-sm text-green-200 font-bold">
          {profileInfo.name}
        </div>
        <div className="text-xs text-zinc-300">
          @{profileInfo.handle.replace("lens/", "")}
        </div>
      </div>
    </div>
  )
}

export default MiniAddressPill
