import React from 'react';
import { 
  User, 
  Sparkles, 
  Heart, 
  Award, 
  Crown, 
  Building2, 
  Star, 
  Music, 
  Mic, 
  Flame, 
  ShieldCheck,
  Zap,
  Gem,
  Tent
} from 'lucide-react';

interface ReviewAvatarProps {
  name: string;
  avatarIcon?: string;
  avatarBg?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ICON_PALETTES = [
  { bg: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300', Icon: Sparkles },
  { bg: 'bg-blue-500/20 border-blue-400/30 text-blue-300', Icon: Building2 },
  { bg: 'bg-rose-500/20 border-rose-400/30 text-rose-300', Icon: Heart },
  { bg: 'bg-amber-500/20 border-amber-400/30 text-amber-300', Icon: Award },
  { bg: 'bg-purple-500/20 border-purple-400/30 text-purple-300', Icon: Music },
  { bg: 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300', Icon: Crown },
  { bg: 'bg-indigo-500/20 border-indigo-400/30 text-indigo-300', Icon: Star },
  { bg: 'bg-teal-500/20 border-teal-400/30 text-teal-300', Icon: ShieldCheck },
  { bg: 'bg-orange-500/20 border-orange-400/30 text-orange-300', Icon: Flame },
  { bg: 'bg-violet-500/20 border-violet-400/30 text-violet-300', Icon: Gem },
  { bg: 'bg-sky-500/20 border-sky-400/30 text-sky-300', Icon: Tent },
];

export const ReviewAvatar: React.FC<ReviewAvatarProps> = ({
  name,
  avatarIcon,
  avatarBg,
  size = 'md'
}) => {
  // Deterministic icon selection based on name string hash
  const hash = (name || 'Client').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palette = ICON_PALETTES[hash % ICON_PALETTES.length];

  let SelectedIcon = palette.Icon;
  if (avatarIcon === 'heart') SelectedIcon = Heart;
  else if (avatarIcon === 'building') SelectedIcon = Building2;
  else if (avatarIcon === 'sparkles') SelectedIcon = Sparkles;
  else if (avatarIcon === 'music') SelectedIcon = Music;
  else if (avatarIcon === 'award') SelectedIcon = Award;
  else if (avatarIcon === 'crown') SelectedIcon = Crown;
  else if (avatarIcon === 'star') SelectedIcon = Star;
  else if (avatarIcon === 'mic') SelectedIcon = Mic;
  else if (avatarIcon === 'user') SelectedIcon = User;

  const sizeClasses = {
    sm: 'w-9 h-9 min-w-[36px] min-h-[36px]',
    md: 'w-11 h-11 min-w-[44px] min-h-[44px]',
    lg: 'w-14 h-14 min-w-[56px] min-h-[56px]',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const activeBg = avatarBg || palette.bg;

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center border backdrop-blur-md shadow-md ${activeBg} transition-transform hover:scale-105 shrink-0`}
      title={name}
      aria-label={`Review avatar for ${name}`}
    >
      <SelectedIcon className={`${iconSizes[size]} shrink-0`} />
    </div>
  );
};
