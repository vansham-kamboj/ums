export default function StatCard({ title, value, icon: Icon, color = 'primary', trend, trendValue, subtitle }) {
  const colorMap = {
    primary: { bg: 'bg-brand-100', icon: 'text-brand-600', border: 'border-primary-100' },
    success: { bg: 'bg-success-50', icon: 'text-success-600', border: 'border-success-100' },
    warning: { bg: 'bg-warning-50', icon: 'text-warning-600', border: 'border-warning-100' },
    danger: { bg: 'bg-danger-50', icon: 'text-danger-600', border: 'border-danger-100' },
    accent: { bg: 'bg-accent-50', icon: 'text-accent-600', border: 'border-accent-100' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-100' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className={`bg-surface rounded-md border ${c.border} p-5 hover:shadow-md transition-shadow group`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value ?? '—'}</p>
          {subtitle && <p className="text-xs text-text-disabled">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-md ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
          {Icon && <Icon className={`w-5 h-5 ${c.icon}`} />}
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={`text-xs font-semibold ${trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
          <span className="text-xs text-text-disabled">vs last month</span>
        </div>
      )}
    </div>
  );
}
