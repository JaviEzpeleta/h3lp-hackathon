import BigTitle from "./BigTitle"
import BlurryEntrance from "./BlurryEntrance"
import FireworksComponent from "./FireworksComponent"
import MiniTitle from "./MiniTitle"
import Title from "./Title"

const PuchaseConfirmationComponent = () => {
  return (
    <div>
      <div className="pointer-events-none">
        <FireworksComponent />
      </div>
      <BlurryEntrance delay={0.12}>
        <div className="px-4 w-full flex justify-center py-6 bg-rfGreen/30 rounded-2xl">
          <div className="flex flex-col items-center gap-4">
            <BigTitle>Purchase confirmed!!</BigTitle>
            <BlurryEntrance delay={0.32}>
              <Title>LFG LFG LFG LFG 🔥 🔥 🔥 🔥 🔥</Title>
            </BlurryEntrance>
            <BlurryEntrance delay={0.8}>
              <MiniTitle>
                Thank you for being part of the H3LP family!
              </MiniTitle>
            </BlurryEntrance>
          </div>
        </div>
      </BlurryEntrance>
    </div>
  )
}

export default PuchaseConfirmationComponent
