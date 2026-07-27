import { FolderOpen } from 'lucide-react';

export default function EmptyState({ title = 'No records found', message = 'Get started by creating a new record.', icon: Icon = FolderOpen, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-md bg-bg flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-text-disabled" />
      </div>
      <h3 className="text-lg font-semibold text-text-secondary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary text-center max-w-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
