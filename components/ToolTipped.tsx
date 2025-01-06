import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ToolTipped = ({
  text,
  children,
  side = "top",
  disabled,
}: {
  text: string
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  disabled?: boolean
}) => {
  const textMap = {
    // translate ad_manager to Ad Manager
    admin: "Admin",
    editor: "Editor",
    viewer: "Viewer",
    ad_manager: "Ad Manager",
    client: "Client",
    basic: "Basic",
  } as Record<string, string>

  if (disabled) return <>{children}</>

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip disableHoverableContent={true}>
        <TooltipTrigger asChild>
          {children}
          {/* <Button variant="outline">Hover</Button> */}
        </TooltipTrigger>
        <TooltipContent className="bg-zinc-600" side={side}>
          <p className="text-base font-museo">{textMap[text] || text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ToolTipped
