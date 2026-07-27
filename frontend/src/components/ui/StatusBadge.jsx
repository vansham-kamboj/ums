const presets = {
  active: { label: 'Active', className: 'bg-success-50 text-success-700 border-success-200' },
  inactive: { label: 'Inactive', className: 'bg-bg text-text-secondary border-border' },
  pending: { label: 'Pending', className: 'bg-warning-50 text-warning-600 border-warning-200' },
  approved: { label: 'Approved', className: 'bg-success-50 text-success-700 border-success-200' },
  rejected: { label: 'Rejected', className: 'bg-danger-50 text-danger-700 border-danger-200' },
  open: { label: 'Open', className: 'bg-brand-100 text-brand-600 border-brand-100' },
  closed: { label: 'Closed', className: 'bg-bg text-text-secondary border-border' },
  draft: { label: 'Draft', className: 'bg-secondary-100 text-secondary-600 border-secondary-200' },
  published: { label: 'Published', className: 'bg-success-50 text-success-700 border-success-200' },
  resolved: { label: 'Resolved', className: 'bg-accent-50 text-accent-700 border-accent-200' },
  in_progress: { label: 'In Progress', className: 'bg-brand-100 text-brand-600 border-brand-100' },
  cancelled: { label: 'Cancelled', className: 'bg-danger-50 text-danger-700 border-danger-200' },
  paid: { label: 'Paid', className: 'bg-success-50 text-success-700 border-success-200' },
  unpaid: { label: 'Unpaid', className: 'bg-danger-50 text-danger-700 border-danger-200' },
  partial: { label: 'Partial', className: 'bg-warning-50 text-warning-600 border-warning-200' },
  present: { label: 'Present', className: 'bg-success-50 text-success-700 border-success-200' },
  absent: { label: 'Absent', className: 'bg-danger-50 text-danger-700 border-danger-200' },
  late: { label: 'Late', className: 'bg-warning-50 text-warning-600 border-warning-200' },
  true: { label: 'Yes', className: 'bg-success-50 text-success-700 border-success-200' },
  false: { label: 'No', className: 'bg-bg text-text-secondary border-border' },
};

export default function StatusBadge({ status, label, size = 'sm' }) {
  const key = String(status).toLowerCase().replace(/\s+/g, '_');
  const preset = presets[key];
  const displayLabel = label || preset?.label || String(status);
  const className = preset?.className || 'bg-bg text-text-secondary border-border';
  const sizeClass = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${className} ${sizeClass}`}>
      {displayLabel}
    </span>
  );
}
