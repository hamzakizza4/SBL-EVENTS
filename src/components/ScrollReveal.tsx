import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  scale?: number;
  once?: boolean;
  threshold?: number;
  blur?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  yOffset = 36,
  xOffset = 0,
  direction = 'up',
  scale = 1,
  once = true,
  threshold = 0.08,
  blur = false,
  ...rest
}) => {
  let initialY = 0;
  let initialX = 0;

  if (direction === 'up') initialY = yOffset;
  else if (direction === 'down') initialY = -yOffset;
  else if (direction === 'left') initialX = xOffset || 36;
  else if (direction === 'right') initialX = -(xOffset || 36);

  const initialScale = scale !== 1 ? scale : 0.98;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: initialY,
        x: initialX,
        scale: initialScale,
        filter: blur ? 'blur(8px)' : 'none',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{
        once,
        amount: threshold,
        margin: '0px 0px -40px 0px',
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Ultra smooth cubic-bezier curve
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  threshold?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.08,
  once = true,
  threshold = 0.06,
  ...rest
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold, margin: '0px 0px -30px 0px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.05,
          },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
  duration?: number;
}> = ({ children, className = '', yOffset = 25, duration = 0.65 }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yOffset, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

