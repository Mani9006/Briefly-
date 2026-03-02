export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-gray-100 rounded-lg animate-pulse mt-2" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-xl animate-pulse hidden sm:block" />
      </div>

      {/* Usage bar skeleton */}
      <div className="mb-6 p-4 bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="h-2 bg-gray-100 rounded-full" />
      </div>

      {/* Search skeleton */}
      <div className="h-11 bg-white border border-gray-200 rounded-xl mb-4 animate-pulse" />

      {/* Tags skeleton */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>

      {/* List skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-40 bg-gray-100 rounded animate-pulse mt-2" />
            </div>
            <div className="h-5 w-14 bg-gray-100 rounded animate-pulse hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  )
}
