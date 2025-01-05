const PriceTag = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-lg font-bold bg-yellow-300/60 py-1 -skew-y-[2deg] px-2">
      {children}
    </div>
  )
}

export default PriceTag
