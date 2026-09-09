import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  Keyboard, 
  X, 
  Command, 
  Search, 
  Calendar, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Palette,
  ArrowRight
} from 'lucide-react';

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
    actionLabel?: string;
  }[];
}

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, closeShortcuts, theme } = useApp();

  if (!isShortcutsOpen) return null;

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: 'Global Accessibility & Navigation',
      shortcuts: [
        { keys: ['Ctrl', 'K'], description: 'Open global search palette across services & gallery' },
        { keys: ['Cmd', 'K'], description: 'Open search on macOS' },
        { keys: ['Esc'], description: 'Close any active modal, dialog, or drawer' },
        { keys: ['?'], description: 'Open / close this keyboard shortcuts guide' },
      ]
    },
    {
      title: 'Quick Page Shortcuts (Press keys sequentially)',
      shortcuts: [
        { keys: ['G', 'H'], description: 'Go to Home page' },
        { keys: ['G', 'G'], description: 'Go to Events Done (Gallery)' },
        { keys: ['G', 'S'], description: 'Go to Availability & Stock Calendar' },
        { keys: ['G', 'C'], description: 'Go to Book & Contact view' },
        { keys: ['G', 'A'], description: 'Go to Admin & Employee Portal' },
      ]
    },
    {
      title: 'Instant Actions & Customization',
      shortcuts: [
        { keys: ['B'], description: 'Open Instant Event Booking Wizard' },
        { keys: ['T'], description: 'Cycle through visual color themes' },
        { keys: ['/'], description: 'Focus search input bar directly' },
      ]
    }
  ];

  return (
    <AnimatePresence>
      <div
        id="keyboard-shortcuts-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeShortcuts();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative max-w-xl w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-[#09101C] text-white shadow-2xl shadow-black/80 flex flex-col max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-[#060B14] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-white font-['Outfit']">
                  Keyboard Shortcuts
                </h3>
                <p className="text-xs text-slate-400">
                  Speed through SBL Events with keyboard controls
                </p>
              </div>
            </div>

            <button
              onClick={closeShortcuts}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
            {shortcutGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <span>{group.title}</span>
                </h4>

                <div className="space-y-2">
                  {group.shortcuts.map((sc, scIdx) => (
                    <div
                      key={scIdx}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-slate-200 text-xs sm:text-sm font-medium">
                        {sc.description}
                      </span>

                      <div className="flex items-center gap-1 shrink-0">
                        {sc.keys.map((key, keyIdx) => (
                          <React.Fragment key={keyIdx}>
                            <kbd className="px-2.5 py-1 rounded-lg bg-[#0F1D32] border border-white/20 font-mono font-bold text-xs text-amber-200 shadow-inner">
                              {key}
                            </kbd>
                            {keyIdx < sc.keys.length - 1 && (
                              <span className="text-slate-500 text-xs font-bold">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Email Dispatch Notice */}
            <div className="p-4 rounded-2xl bg-[#060D17] border border-white/10 flex items-center justify-between gap-3 text-xs">
              <div className="text-slate-300">
                <strong className="text-white">Central Operations Inquiries:</strong>
                <p className="text-[11px] text-slate-400 mt-0.5">All confirmations and direct inquiries forward to:</p>
              </div>
              <span className="text-amber-300 font-mono font-bold px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30">
                najibshafiq@sblevents.com
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#060B14] border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-white">ESC</kbd> anytime to dismiss
            </span>

            <button
              onClick={closeShortcuts}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
