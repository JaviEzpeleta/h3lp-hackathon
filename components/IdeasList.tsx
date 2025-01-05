import { GeneratedIdea } from "@/lib/types"
import Title from "./Title"
import SubTitle from "./SubTitle"
import { cleanHandle } from "@/lib/strings"
import Link from "next/link"
import PriceTag from "./PriceTag"

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
    <div className="flex flex-col w-full max-w-2xl mx-auto py-28 px-2">
      <div className="text-center">
        <Title>Products & Service Ideas</Title>
        <Title>
          <div className="inline-flex items-center gap-2">
            <div>for</div>
            <div className="flex items-center gap-1">
              <Link
                href={`https://hey.xyz/u/${cleanHandle(toProfile.handle)}`}
                target="_blank"
                className="active:opacity-50 hover:scale-105 transition-all active:scale-95 translate-y-1"
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
      <div className="space-y-4 py-4">
        {ideas.map((idea: GeneratedIdea, index: number) => (
          <div
            key={index}
            className="p-4 rounded-lg border-[3px] border-black flex items-center justify-between gap-4"
          >
            <div className="w-14 h-14 border-[3px] border-black rounded-md"></div>

            <div className="flex-1">
              <SubTitle>{idea.product_name}</SubTitle>
              <div className="flex items-center gap-2">
                <PriceTag>
                  ${idea.product_price}
                  {idea.payment_type === "recurring (monthly)" && "/month"}
                </PriceTag>
              </div>
            </div>
            <div>BOX</div>
            {/* <div>{idea.product_description}</div> */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default IdeasList
