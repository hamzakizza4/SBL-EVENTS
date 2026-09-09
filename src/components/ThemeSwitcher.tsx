import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ThemeMode } from '../types';
import { Palette, Sparkles, Moon, Crown, Check, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ThemeSwitcher: React.FC<{ variant?: 'floating' | 'header' | 'compact' }> = ({ variant = 'floating' }) => {
  const { theme, setTheme, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions: {
    id: ThemeMode;
    name: string;
    description: string;
    previewColors: string[];
    icon: React.ReactNode;
  }[] = [
    {
      id: 'medium-dark-blue',
      name: 'Original Royal Blue & White',
      description: 'The signature SBL Events clean deep royal blue with crisp white surfaces & blue accents',
      previewColors: ['#060E1E', '#0B1A34', '#FFFFFF', '#2563EB'],
      icon: <Sparkles className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'deep-navy-blue',
      name: 'Midnight Navy & Pure White',
      description: 'Deep obsidian navy night canvas with clean white text and royal blue accents',
      previewColors: ['#030914', '#071326', '#FFFFFF', '#3B82F6'],
      icon: <Moon className="w-4 h-4 text-blue-300" />,
    },
    {
      id: 'white-brown-light',
      name: 'Crisp White & Royal Blue',
      description: 'Luminous crisp white layout with deep royal blue headers and clean slate borders',
      previewColors: ['#F4F7FC', '#FFFFFF', '#060E1E', '#2563EB'],
      icon: <Crown className="w-4 h-4 text-blue-600" />,
    },
  ];

  const handleSelectTheme = (newTheme: ThemeMode, name: string) => {
    setTheme(newTheme);
    setIsOpen(false);
    showToast('Theme Updated', `Switched to "${name}".`, 'success');
  };

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all bg-white/10 text-white border-white/20 hover:bg-white/20 shadow-xs cursor-pointer"
          title="Switch Color Theme"
        >
          <Palette className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline font-medium">Theme Palette</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 bg-[#0A1830] rounded-2xl p-4 border border-blue-500/30 shadow-2xl z-50 text-white"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-500/20">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-blue-400" /> Select Visual Theme
                </span>
                <button onClick={() => setIsOpen(false)} className="text-blue-200/60 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                {themeOptions.map((opt) => {
                  const isSelected = theme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectTheme(opt.id, opt.name)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold shadow-md'
                          : 'hover:bg-white/10 text-blue-100 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white text-blue-900' : 'bg-white/10'}`}>
                          {opt.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-xs">{opt.name}</div>
                          <div className={`text-[10px] line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-blue-200/70'}`}>
                            {opt.description}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#0B1A34]/95 text-white border border-blue-400/30 shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-md font-bold text-xs cursor-pointer"
        >
          <Palette className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline font-medium">Color Palette</span>
          <span className="w-2 h-2 rounded-full bg-blue-400 shadow-xs" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-16 right-0 w-80 sm:w-96 bg-[#091529] rounded-3xl p-5 border border-blue-500/30 shadow-2xl z-50 text-white space-y-3"
            >
              <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white font-['Outfit']">
                      Theme Palette
                    </h3>
                    <p className="text-[11px] text-blue-200/70">
                      Classic Royal Blue & Crisp White
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-blue-200/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {themeOptions.map((opt) => {
                  const isSelected = theme === opt.id || (opt.id === 'medium-dark-blue' && (theme === 'white-brown' || theme === 'royal-emerald-gold' || theme === 'amethyst-rosegold' || theme === 'crimson-obsidian'));
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectTheme(opt.id, opt.name)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold shadow-lg border-blue-400'
                          : 'bg-[#0E1F3D] border-blue-500/20 hover:border-blue-400/50 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${isSelected ? 'bg-white text-blue-900 border-transparent' : 'bg-white/10 border-white/15'}`}>
                          {opt.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs">{opt.name}</span>
                            {isSelected && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-white text-blue-900">
                                Active
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-blue-200/70'}`}>
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {opt.previewColors.map((col, idx) => (
                          <span
                            key={idx}
                            className="w-3 h-3 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: col }}
                          />
                        ))}
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-white text-blue-900 flex items-center justify-center ml-1 shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[10px] text-blue-200/60 text-center pt-1">
                Classic Blue & White design matching SBL Events original identity.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
