import UploadProductFileModule from "@/components/UploadProductFileModule"

export default function NewPage() {
  return (
    <div className="max-w-xl mx-auto my-10 py-32">
      <div className="bg-slate-800/50 p-6 rounded-xl">
        <UploadProductFileModule />
      </div>
    </div>
  )
}
