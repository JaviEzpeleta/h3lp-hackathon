const BigPriceTag = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-xl md:text-3xl font-bold bg-yellow-300/60 py-2 -skew-y-[2deg] px-4">
      {children}
    </div>
  )
}

export default BigPriceTag
