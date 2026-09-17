const presets = {
  // Success (Green)
  active: { label: 'Active', className: 'badge-status-success' },
  approved: { label: 'Approved', className: 'badge-status-success' },
  enrolled: { label: 'Enrolled', className: 'badge-status-success' },
  converted: { label: 'Converted', className: 'badge-status-success' },
  published: { label: 'Published', className: 'badge-status-success' },
  paid: { label: 'Paid', className: 'badge-status-success' },
  present: { label: 'Present', className: 'badge-status-success' },
  resolved: { label: 'Resolved', className: 'badge-status-success' },
  true: { label: 'Yes', className: 'badge-status-success' },

  // Warning (Amber / Dark Espresso Text)
  pending: { label: 'Pending', className: 'badge-status-warning' },
  followed_up: { label: 'Followed Up', className: 'badge-status-warning' },
  partial: { label: 'Partial', className: 'badge-status-warning' },
  late: { label: 'Late', className: 'badge-status-warning' },
  under_review: { label: 'Under Review', className: 'badge-status-warning' },
  waiting: { label: 'Waiting', className: 'badge-status-warning' },

  // Danger (Rose Red)
  rejected: { label: 'Rejected', className: 'badge-status-danger' },
  inactive: { label: 'Inactive', className: 'badge-status-danger' },
  cancelled: { label: 'Cancelled', className: 'badge-status-danger' },
  unpaid: { label: 'Unpaid', className: 'badge-status-danger' },
  absent: { label: 'Absent', className: 'badge-status-danger' },
  suspended: { label: 'Suspended', className: 'badge-status-danger' },
  false: { label: 'No', className: 'badge-status-danger' },

  // Info / Sky Blue
  new: { label: 'New', className: 'badge-status-info' },
  open: { label: 'Open', className: 'badge-status-info' },
  registered: { label: 'Registered', className: 'badge-status-info' },

  // Brand / Indigo Blue
  in_progress: { label: 'In Progress', className: 'badge-status-brand' },
  offer_sent: { label: 'Offer Sent', className: 'badge-status-brand' },
  ongoing: { label: 'Ongoing', className: 'badge-status-brand' },

  // Purple
  interested: { label: 'Interested', className: 'badge-status-purple' },
  graduated: { label: 'Graduated', className: 'badge-status-purple' },
  alumni: { label: 'Alumni', className: 'badge-status-purple' },

  // Neutral / Gray
  draft: { label: 'Draft', className: 'badge-status-neutral' },
  closed: { label: 'Closed', className: 'badge-status-neutral' },
  completed: { label: 'Completed', className: 'badge-status-neutral' },
  upcoming: { label: 'Upcoming', className: 'badge-status-neutral' },
};

export default function StatusBadge({ status, label, size = 'sm' }) {
  if (!status && status !== false) return null;
  const key = String(status).toLowerCase().replace(/\s+/g, '_');
  const preset = presets[key];
  const displayLabel = label || preset?.label || String(status);
  const badgeClass = preset?.className || 'badge-status-neutral';

  return (
    <span className={`badge-status ${badgeClass} ${size === 'xs' ? '!text-[10px] !px-2 !py-0.5' : ''}`}>
      {displayLabel}
    </span>
  );
}
