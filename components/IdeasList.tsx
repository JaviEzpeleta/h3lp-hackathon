import { GeneratedIdea } from "@/lib/types"
import Title from "./Title"
import SubTitle from "./SubTitle"
import AnimatedStar from "./AnimatedStar"
import { cleanHandle } from "@/lib/strings"
import Link from "next/link"
import PriceTag from "./PriceTag"
import MegaTitle from "./MegaTitle"
import BigTitle from "./BigTitle"
import NewProductModal from "./NewProductModal"
import { useState } from "react"

const IdeasList = ({
  ideas,
  fromProfile,
  toProfile,
}: {
  ideas: GeneratedIdea[]
  fromProfile: any
  toProfile: any
}) => {
  const [selectedIdea, setSelectedIdea] = useState<GeneratedIdea | null>(null)
  const prefillForm = (idea: GeneratedIdea) => {
    setSelectedIdea(idea)
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto py-28 px-2">
      <NewProductModal
        idea={selectedIdea}
        onClose={() => {
          setSelectedIdea(null)
        }}
        onSave={() => {}}
        modalOn={selectedIdea !== null}
      />
      <div className="text-center">
        <BigTitle>Products & Service</BigTitle>
        <BigTitle>Products & Service</BigTitle>
        <BigTitle>
          <div className="text-indigo-700">(Ideas)</div>
        </BigTitle>
        <Title>
          <div className="inline-flex items-center gap-2 pt-1">
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
            className="p-4 relative rounded-lg border-[3px] border-black flex items-center justify-between gap-4"
          >
            <div className="w-14 h-14 border-[3px] border-black rounded-md">
              <AnimatedStar onClick={() => prefillForm(idea)} />
            </div>

            <div className="flex-1 pr-16">
              <SubTitle>{idea.product_name}</SubTitle>
              <div className="flex items-center gap-2">
                <PriceTag>
                  ${idea.product_price}
                  {idea.payment_type === "recurring (monthly)" && "/month"}
                </PriceTag>
              </div>
            </div>
            <div className="h-full absolute right-0 w-[80px] flex justify-end p-1 pt-4 pr-2">
              <div className="flex flex-wrap items-start justify-end gap-0">
                {idea.inspired_by_publication_ids.map((id, index) => (
                  <div key={index}>
                    <Link
                      href={`https://hey.xyz/posts/${id}`}
                      target="_blank"
                      className="border border-transparent rounded-md hover:border-black/20 hover:scale-[112%] 
                            transition-all active:scale-95 active:opacity-50 group inline-block"
                    >
                      <div
                        className="rounded-md opacity-75 group-hover:opacity-100 p-1 group-active:rotate-[360deg]
                       bg-transparent group-hover:bg-white/50 group-hover:rotate-[180deg] transition-all"
                      >
                        <img src="/img/hey-icon.png" className="w-5" />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            {/* <div>{idea.product_description}</div> */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default IdeasList
