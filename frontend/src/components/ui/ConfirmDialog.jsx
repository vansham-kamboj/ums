import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure?', confirmText = 'Delete', variant = 'danger', loading = false }) {
  const variants = {
    danger: 'bg-danger-600 hover:bg-danger-700 text-white',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white',
    primary: 'bg-brand-600 hover:bg-brand-500 text-white',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:bg-bg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${variants[variant]}`}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-danger-100 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-danger-600" />
        </div>
        <p className="text-sm text-text-secondary pt-2">{message}</p>
      </div>
    </Modal>
  );
}
