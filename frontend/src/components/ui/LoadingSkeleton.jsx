export default function LoadingSkeleton({ rows = 5, columns = 4, type = 'table' }) {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-3 w-24 rounded-lg animate-shimmer" />
                <div className="h-7 w-16 rounded-lg animate-shimmer" />
              </div>
              <div className="w-11 h-11 rounded-xl animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex gap-4 px-6 py-4 bg-card/30 border-b border-glass-border">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1 h-4 rounded-lg animate-shimmer" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-6 py-4 border-b border-glass-border">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="flex-1 h-4 rounded-lg animate-shimmer" />
          ))}
        </div>
      ))}
    </div>
  );
}
