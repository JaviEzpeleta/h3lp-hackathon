import { GeneratedIdea } from "@/lib/types"
import Title from "./Title"
import SubTitle from "./SubTitle"
import { cleanHandle } from "@/lib/strings"
import Link from "next/link"

const IdeasList = ({
  ideas,
  fromProfile,
  toProfile,
}: {
  ideas: GeneratedIdea[]
  fromProfile: any
  toProfile: any
}) => {
  console.log("ideas")
  console.log(ideas)
  console.log(fromProfile)
  console.log(toProfile)
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      <div className="text-center">
        <Title>Products & Service Ideas</Title>
        <Title>
          <div className="inline-flex items-center gap-2">
            <div>for</div>
            <div className="flex items-center gap-1">
              <Link
                href={`https://hey.xyz/u/${cleanHandle(toProfile.handle)}`}
                target="_blank"
              >
                <span
                  className="w-9 rounded-lg h-9 inline-block border-[1.5px] border-black"
                  style={{
                    backgroundImage: `url(${toProfile.profile_picture})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </Link>
              <div>{cleanHandle(toProfile.handle)}</div>
            </div>
          </div>
        </Title>
      </div>
      <div>
        {ideas.map((idea: GeneratedIdea, index: number) => (
          <div key={index} className="p-4 rounded-lg">
            {idea.product_name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default IdeasList
