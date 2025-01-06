import { CgSpinnerTwo } from "react-icons/cg"
import BlurryEntrance from "./BlurryEntrance"

const LoadingIndicator = () => {
  return (
    <div className="w-full flex justify-center">
      <BlurryEntrance delay={0}>
        <div className="animate-pulse">
          <CgSpinnerTwo className="animate-spin text-4xl text-indigo-300" />
        </div>
      </BlurryEntrance>
    </div>
  )
}

export default LoadingIndicator
