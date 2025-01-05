import classNames from "classnames"
import BlurryEntranceFaster from "./BlurryEntranceFaster"

export const linkRenderer = (props: any) => (
  <a
    {...props}
    className={classNames(
      "text-blue-600",
      "hover:text-blue-800",
      "transition-colors"
    )}
    target="_blank"
    rel="noreferrer"
  />
)

export const h1Renderer = (props: any) => (
  <div
    {...props}
    className={classNames(
      "mb-4 mt-4 text-xl font-medium tracking-tight text-zinc-800 dark:text-zinc-200 sm:text-3xl"
    )}
  />
)
export const h1RendererDark = (props: any) => (
  <div
    {...props}
    className={classNames(
      "mb-4 mt-4 text-xl font-medium tracking-tight text-zinc-200 sm:text-3xl"
    )}
  />
)
export const h1RendererMessage = (props: any) => (
  <div
    {...props}
    className={classNames(
      "mb-4 mt-4 text-lg font-medium tracking-tight text-zinc-800 dark:text-zinc-200 sm:text-xl"
    )}
  />
)

export const strongRendererMessage = (props: any) => (
  <strong {...props} className={classNames("font-semibold")} />
)

export const h2Renderer = (props: any) => (
  <div
    {...props}
    className={classNames(
      "font-light",
      "mb-4 pt-6 text-base uppercase tracking-wider text-zinc-600 dark:text-zinc-300 sm:text-xl"
    )}
  />
)
export const h2RendererDark = (props: any) => (
  <div
    {...props}
    className={classNames(
      "font-light",
      "mb-4 pt-6 text-base uppercase tracking-wider text-zinc-300 sm:text-xl"
    )}
  />
)

export const h2RendererMessage = (props: any) => (
  <div
    {...props}
    className={classNames(
      "font-light",
      "mb-4 pt-6 text-base uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
    )}
  />
)
export const h3Renderer = (props: any) => (
  <div
    {...props}
    className={classNames(
      "",
      "",
      "font-medium mt-4 py-2 pt-6 text-2xl sm:text-3xl tracking-tight text-zinc-800 dark:text-zinc-200"
    )}
  />
)

export const codeRenderMessage = (props: any) => (
  <span className="inline-block bg-white/40 rounded-sm p-0.1 px-1 text-sm">
    <pre {...props}>{props.children}</pre>
  </span>
)

// ! in case we want to let people copy every code block easily (but it's not an inline-block thing tho 😢)
// export const codeRenderMessage = (props: any) => (
//   <div className="">
//     <div className="flex justify-end pt-1">
//       <Button
//         onClick={() => {
//           navigator.clipboard.writeText(props.children)
//           toast.success("Copied to clipboard")
//         }}
//         size="sm"
//         variant="secondary"
//         className="group hover:bg-indigo-300 bg-indigo-900/50 transition-all -translate-y-1"
//       >
//         <div className="text-xs flex items-center gap-2 text-emerald-500 group-hover:text-emerald-700">
//           <div className="font-medium tracking-tight">copy</div>
//           <div className="">
//             <LuCopy />
//           </div>
//         </div>
//       </Button>
//     </div>
//     <pre
//       {...props}
//       className="text-xs mb-4 bg-emerald-950/100 shadow-md shadow-black/30 p-2 rounded-md block whitespace-pre-wrap break-words"
//     >
//       {props.children}
//     </pre>
//   </div>
// )

export const h3RendererMessage = (props: any) => (
  <div
    {...props}
    className={classNames(
      "",
      "",
      "font-semibold mt-2 py-2 pt-4 text-lg sm:text-xl tracking-tight text-zinc-600"
    )}
  />
)

export const h4Renderer = (props: any) => (
  <div
    {...props}
    className={classNames(
      "mb-4 text-lg font-medium tracking-tight text-zinc-800 dark:text-zinc-200 sm:text-xl"
    )}
  />
)

export const hrRenderer = (props: any) => (
  <div
    {...props}
    className={classNames(
      "border-t border-green-600/60",
      "my-4",
      "w-full",
      "h-0"
    )}
  />
)

export const pRenderer = (props: any) => (
  <p
    {...props}
    className={classNames("text-sm sm:text-lg font-light lg:text-xl mt-2 mb-4")}
  />
)
export const pRendererMessage = (props: any) => (
  <p {...props} className={classNames("text-base mt-0.5 mb-2.5")} />
)
// export const pRendererMessage = (props: any) => <p {...props} className={classNames("text-base mt-2 mb-4")} />

export const liRenderer = (props: any) => (
  <li {...props} className={classNames("text-base sm:text-lg", "m-2 p-0")} />
)
export const liRendererMessage = (props: any) => (
  <li
    {...props}
    className={classNames("text-base", "m-0 mb-3 p-0 list-disc ml-4")}
  />
)

export const ulRenderer = (props: any) => (
  <ul
    {...props}
    className={classNames(
      "text-lg list-disc pl-1.5 sm:pl-4 marker:text-indigo-600 dark:marker:text-indigo-400",
      "m-2 p-0"
    )}
  />
)

export const olRendererMessage = (props: any) => (
  <ol
    {...props}
    className={classNames(
      "text-base list-decimal pl-1.5 sm:pl-4 marker:text-indigo-600 m-2 p-0"
    )}
  />
)

export const olRenderer = (props: any) => (
  <ol
    {...props}
    className={classNames(
      "text-base list-decimal pl-1.5 sm:pl-4 marker:text-indigo-600 m-2 p-0"
    )}
  />
)

export const preRenderer = (props: any) => (
  <pre {...props} className={classNames("text-xs", "bg-black/80")} />
)

export const emRenderer = (props: any) => (
  <BlurryEntranceFaster>
    <div className="px-2 lg:px-4">
      <div
        {...props}
        className={classNames(
          "",
          "mt-12 mb-8 p-2 bg-indigo-50 dark:bg-indigo-950  font-medium rounded-md shadow-md lg:px-8 lg:py-4 shadow-indigo-200"
        )}
      />
    </div>
  </BlurryEntranceFaster>
)
