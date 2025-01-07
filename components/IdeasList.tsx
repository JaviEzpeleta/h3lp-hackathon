import { GeneratedIdea, LensSavedProfile } from "@/lib/types"
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
import ToolTipped from "./ToolTipped"
import MiniTitle from "./MiniTitle"
import BlurryEntrance from "./BlurryEntrance"

const IdeasList = ({
  ideas,
  creatorProfile,
  targetProfile,
}: {
  ideas: GeneratedIdea[]
  creatorProfile: LensSavedProfile
  targetProfile: LensSavedProfile
}) => {
  const [selectedIdea, setSelectedIdea] = useState<GeneratedIdea | null>(null)
  const prefillForm = (idea: GeneratedIdea) => {
    setSelectedIdea(idea)
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-2">
      <NewProductModal
        idea={selectedIdea}
        creatorProfile={creatorProfile}
        targetProfile={targetProfile}
        onClose={() => {
          setSelectedIdea(null)
        }}
        onSave={() => {}}
        modalOn={selectedIdea !== null}
      />
      <div className="text-center">
        <BigTitle>Products & Services</BigTitle>
        <BigTitle>
          <ToolTipped text="These are just ideas... Use any of them as a starting point for creating actual products!">
            <div className="text-indigo-800">
              (Ideas<span className="text-ttRed">*</span>)
            </div>
          </ToolTipped>
        </BigTitle>
        {targetProfile.handle === creatorProfile.handle ? (
          <MiniTitle>
            <div className="inline-flex items-center gap-2 pt-1">
              <div>by</div>
              <div className="flex items-center gap-1">
                <Link
                  href={`https://hey.xyz/u/${cleanHandle(
                    creatorProfile.handle
                  )}`}
                  target="_blank"
                  className="active:opacity-50 hover:scale-105 transition-all active:scale-95 translate-y-1"
                >
                  <span
                    className="w-9 rounded-lg h-9 inline-block border-[1.5px] border-black"
                    style={{
                      backgroundImage: `url(${creatorProfile.profile_picture})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </Link>
                <div>{cleanHandle(creatorProfile.handle)}</div>
              </div>
            </div>
          </MiniTitle>
        ) : (
          <>
            <MiniTitle>
              <div className="inline-flex items-center gap-2 pt-1">
                <div>by</div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`https://hey.xyz/u/${cleanHandle(
                      creatorProfile.handle
                    )}`}
                    target="_blank"
                    className="active:opacity-50 hover:scale-105 transition-all active:scale-95 translate-y-1"
                  >
                    <span
                      className="w-9 rounded-lg h-9 inline-block border-[1.5px] border-black"
                      style={{
                        backgroundImage: `url(${creatorProfile.profile_picture})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </Link>
                  <div>{cleanHandle(creatorProfile.handle)}</div>
                </div>
              </div>
            </MiniTitle>
            <MiniTitle>
              <div className="inline-flex items-center gap-2 pt-1">
                <div>customized for</div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`https://hey.xyz/u/${cleanHandle(
                      targetProfile.handle
                    )}`}
                    target="_blank"
                    className="active:opacity-50 hover:scale-105 transition-all active:scale-95 translate-y-1"
                  >
                    <span
                      className="w-9 rounded-lg h-9 inline-block border-[1.5px] border-black"
                      style={{
                        backgroundImage: `url(${targetProfile.profile_picture})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </Link>
                  <div>{cleanHandle(targetProfile.handle)}</div>
                </div>
              </div>
            </MiniTitle>
          </>
        )}
      </div>
      <div className="space-y-4 py-4 pb-20">
        {ideas.map((idea: GeneratedIdea, index: number) => (
          <BlurryEntrance delay={index * 0.12} key={index}>
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
          </BlurryEntrance>
        ))}
      </div>
    </div>
  )
}

export default IdeasList
