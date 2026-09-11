import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCheck, AlertCircle, Info, AlertTriangle, MessageSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="flex items-center text-[#53bdeb]" title="Delivered">
            <CheckCheck className="w-4 h-4 text-[#53bdeb] stroke-[2.5]" />
          </div>
        );
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-sky-400 shrink-0" />;
    }
  };

  return (
    <div
      id="toast-container-root"
      className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 max-w-[440px] w-[94%] sm:w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -45, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y < -25) {
                removeToast(toast.id);
              }
            }}
            className="pointer-events-auto w-full rounded-[26px] bg-[#111b21]/95 text-white backdrop-blur-2xl border border-white/12 shadow-[0_20px_45px_rgba(0,0,0,0.65),0_1px_1px_rgba(255,255,255,0.15)_inset] p-3.5 sm:p-4 select-none cursor-grab active:cursor-grabbing relative overflow-hidden"
          >
            {/* iOS Grabber Pill */}
            <div className="w-10 h-1 rounded-full bg-white/25 mx-auto -mt-1 mb-2.5" />

            {/* WhatsApp App Header */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                {/* WhatsApp Brand Icon */}
                <div className="w-5 h-5 rounded-[6px] bg-[#25D366] flex items-center justify-center shadow-md shadow-[#25D366]/30 shrink-0">
                  <MessageSquare className="w-3 h-3 text-white fill-white" />
                </div>
                
                <span className="text-[11px] font-black tracking-wider text-[#25D366] uppercase">
                  WHATSAPP
                </span>
                <span className="text-slate-500 text-[10px]">•</span>
                <span className="text-[11px] font-semibold text-slate-300">
                  SBL Events Live
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-slate-400">
                  now
                </span>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification Body */}
            <div className="flex items-start gap-3">
              {/* Avatar / Status Badge */}
              <div className="w-9 h-9 rounded-full bg-[#202c33] border border-white/10 flex items-center justify-center shrink-0 shadow-inner">
                {getStatusIcon(toast.type)}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="font-bold text-xs sm:text-sm text-white tracking-tight leading-snug">
                    {toast.title}
                  </h5>
                  {toast.referenceNumber && (
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#00a884]/20 text-[#00a884] border border-[#00a884]/40">
                      #{toast.referenceNumber}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>

                {/* Quick Action Button */}
                {toast.actionLabel && toast.onAction && (
                  <div className="mt-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (toast.onAction) toast.onAction();
                        removeToast(toast.id);
                      }}
                      className="px-3.5 py-1 rounded-full bg-[#00a884] hover:bg-[#02906f] text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <span>{toast.actionLabel}</span>
                      <ArrowRight className="w-3 h-3 text-slate-950" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Subtle swipe hint */}
            <div className="text-[9px] text-center text-slate-500 mt-2 font-medium">
              Swipe up to dismiss
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
