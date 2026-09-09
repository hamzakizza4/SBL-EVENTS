import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-slate-900/95';
      case 'error':
        return 'border-rose-500/30 bg-slate-900/95';
      case 'warning':
        return 'border-amber-500/30 bg-slate-900/95';
      default:
        return 'border-sky-500/30 bg-slate-900/95';
    }
  };

  return (
    <div
      id="toast-container-root"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl text-slate-100 ${getBorderColor(
              toast.type
            )}`}
          >
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h5 className="font-bold text-xs sm:text-sm text-white leading-tight">
                  {toast.title}
                </h5>
                {toast.referenceNumber && (
                  <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    #{toast.referenceNumber}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {toast.message}
              </p>
              {toast.actionLabel && toast.onAction && (
                <div className="mt-2.5">
                  <button
                    onClick={() => {
                      if (toast.onAction) toast.onAction();
                      removeToast(toast.id);
                    }}
                    className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <span>{toast.actionLabel}</span>
                    <span className="text-[10px]">&rarr;</span>
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
