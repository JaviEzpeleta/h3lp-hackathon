"use client"

import React, { useEffect, useRef } from "react"
import { Fireworks } from "@fireworks-js/react"
import type { FireworksHandlers } from "@fireworks-js/react"

function FireworksComponent() {
  const ref = useRef<FireworksHandlers>(null)

  useEffect(() => {
    // start the fireworks
    ref.current?.start()
  }, [])

  return (
    <div className="absolute inset-0 z-0">
      <div className="flex items-center justify-center relative h-full z-0">
        {/* <Confetti active={true} /> */}
        <Fireworks
          ref={ref}
          options={{ opacity: 0.5 }}
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            //   position: "fixed",
            // background: "#000",
          }}
        />
      </div>
    </div>
  )
}

export default FireworksComponent
