export default function SplitPanel({ left, right, leftWidth = 'w-96', className = '' }) {
  return (
    <div className={`flex gap-0 h-[calc(100vh-140px)] bg-surface rounded-md border border-border shadow-sm overflow-hidden ${className}`}>
      <div className={`${leftWidth} flex-shrink-0 border-r border-border overflow-y-auto`}>
        {left}
      </div>
      <div className="flex-1 overflow-y-auto">
        {right}
      </div>
    </div>
  );
}
