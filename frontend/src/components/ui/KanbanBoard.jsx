import { useState, useRef } from 'react';

export default function KanbanBoard({ columns, onCardMove, renderCard, renderColumnHeader }) {
  const [dragItem, setDragItem] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const dragRef = useRef(null);

  const handleDragStart = (e, item, fromColumn) => {
    setDragItem({ item, fromColumn });
    dragRef.current = { item, fromColumn };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item.id);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDragItem(null);
    setDragOverCol(null);
  };

  const handleDragOver = (e, columnKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(columnKey);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e, toColumn) => {
    e.preventDefault();
    setDragOverCol(null);
    const ref = dragRef.current;
    if (ref && ref.fromColumn !== toColumn && onCardMove) {
      onCardMove(ref.item, ref.fromColumn, toColumn);
    }
    dragRef.current = null;
    setDragItem(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
      {columns.map((col) => (
        <div
          key={col.key}
          className={`flex-1 min-w-[280px] max-w-[360px] flex flex-col rounded-md transition-colors ${
            dragOverCol === col.key ? 'bg-brand-100/40' : 'bg-bg/60'
          }`}
          onDragOver={(e) => handleDragOver(e, col.key)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, col.key)}
        >
          {/* Column Header */}
          <div className="px-3 py-3 flex items-center justify-between">
            {renderColumnHeader ? renderColumnHeader(col) : (
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-text-primary">{col.label}</h3>
                <span className="text-xs bg-border/80 text-text-secondary rounded-full px-2 py-0.5 font-medium">
                  {col.items.length}
                </span>
              </div>
            )}
          </div>

          {/* Cards */}
          <div className="flex-1 px-2 pb-2 space-y-2 overflow-y-auto">
            {col.items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item, col.key)}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing"
              >
                {renderCard ? renderCard(item, col.key) : (
                  <div className="bg-surface border border-border rounded-md p-3 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-text-primary">{item.title || item.name}</p>
                  </div>
                )}
              </div>
            ))}
            {col.items.length === 0 && (
              <div className="flex items-center justify-center h-20 border-2 border-dashed border-border rounded-md">
                <p className="text-xs text-text-disabled">Drop items here</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
