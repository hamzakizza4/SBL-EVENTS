import React, { useState, useEffect } from 'react';
import { Sparkles, Crown, Image as ImageIcon } from 'lucide-react';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  skeletonClassName?: string;
  icon?: React.ReactNode;
  label?: string;
  showShimmerBadge?: boolean;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  onLoad?: () => void;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
  fetchPriority?: 'high' | 'low' | 'auto';
}

// Global in-memory cache of already loaded image URLs to prevent skeleton flashes
const loadedImageCache = new Set<string>();

export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  skeletonClassName = '',
  icon,
  label,
  showShimmerBadge = false,
  referrerPolicy = 'no-referrer',
  onLoad,
  style,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
}) => {
  const isAlreadyCached = Boolean(src && loadedImageCache.has(src));
  const [isLoaded, setIsLoaded] = useState<boolean>(isAlreadyCached);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }

    if (loadedImageCache.has(src)) {
      setIsLoaded(true);
      return;
    }

    // Preload and cache
    const img = new Image();
    img.src = src;
    if (decoding === 'async' || decoding === 'auto' || decoding === 'sync') {
      img.decoding = decoding;
    }
    
    if (img.complete) {
      loadedImageCache.add(src);
      setIsLoaded(true);
      if (onLoad) onLoad();
    } else {
      img.onload = () => {
        loadedImageCache.add(src);
        setIsLoaded(true);
        if (onLoad) onLoad();
      };
      img.onerror = () => {
        setHasError(true);
      };
    }
  }, [src, decoding, onLoad]);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* SKELETON PLACEHOLDER LAYER */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-[#0B172A] via-[#10223D] to-[#0A1628] overflow-hidden ${skeletonClassName}`}
        >
          {/* Ambient Glowing Aura Rings */}
          <div className="absolute w-40 h-40 rounded-full bg-amber-500/10 filter blur-2xl animate-pulse" />
          <div className="absolute w-32 h-32 rounded-full bg-blue-500/10 filter blur-xl animate-pulse delay-700" />

          {/* Shimmer Wave Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep pointer-events-none" />

          {/* Center Brand Badge & Pulsing Icon */}
          <div className="relative z-20 flex flex-col items-center gap-2 p-3 text-center">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-lg animate-bounce duration-1000">
              {icon || <Crown className="w-5 h-5" />}
            </div>

            {showShimmerBadge && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold text-amber-200 backdrop-blur-md">
                <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-spin" />
                <span>{label || 'Loading SBL Visuals...'}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ERROR FALLBACK */}
      {hasError ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0F1F38] text-slate-400 p-4 text-center">
          <ImageIcon className="w-8 h-8 mb-2 opacity-50 text-slate-500" />
          <span className="text-xs font-semibold">{alt || 'SBL Event Image'}</span>
        </div>
      ) : (
        /* ACTUAL IMAGE */
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          referrerPolicy={referrerPolicy}
          style={style}
          className={`transition-all duration-500 ease-out ${
            isLoaded
              ? 'opacity-100 scale-100 filter-none'
              : 'opacity-0 scale-105 filter blur-sm'
          } ${className}`}
        />
      )}
    </div>
  );
};
