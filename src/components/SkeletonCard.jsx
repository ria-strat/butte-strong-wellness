export default function SkeletonCard() {
  return (
    <div className="flex items-stretch bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="w-1.5 shrink-0 bg-navy/10" />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="h-3 w-16 bg-navy/10 rounded" />
        <div className="h-4 w-3/4 bg-navy/10 rounded" />
        <div className="h-3 w-full bg-navy/10 rounded" />
        <div className="h-3 w-2/3 bg-navy/10 rounded" />
      </div>
    </div>
  )
}
