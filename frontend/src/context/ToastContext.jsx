import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const badgeStyles = {
  success: 'bg-[#10B981] text-white shadow-sm shadow-emerald-500/20',
  error: 'bg-[#EF4444] text-white shadow-sm shadow-red-500/20',
  warning: 'bg-[#F59E0B] text-white shadow-sm shadow-amber-500/20',
  info: 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20',
};

const borderAccent = {
  success: 'border-l-4 border-l-[#10B981]',
  error: 'border-l-4 border-l-[#EF4444]',
  warning: 'border-l-4 border-l-[#F59E0B]',
  info: 'border-l-4 border-l-[#2563EB]',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, leaving: false }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration ?? 6000),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const Icon = icons[t.type] || Info;
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl bg-white border border-[#E2E8F0] ${borderAccent[t.type]} shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_14px_35px_-8px_rgba(15,23,42,0.15)] transition-all ${
                t.leaving ? 'animate-toast-out' : 'animate-toast-in'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${badgeStyles[t.type]}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-xs font-bold text-[#0F172A] leading-snug flex-1 tracking-tight">{t.message}</p>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastContext;
