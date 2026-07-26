'use client';

import { motion, useMotionValue, useSpring, useTransform, MotionProps } from 'framer-motion';
import { ReactNode, useRef, MouseEvent } from 'react';

/* ─── FadeIn ─── */
interface FadeInProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
  distance?: number;
}

export function FadeIn({ children, direction = 'up', delay = 0, duration = 0.6, className = '', distance = 40 }: FadeInProps) {
  const dirMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };
  const d = dirMap[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...d }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── ScaleIn ─── */
interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({ children, delay = 0, duration = 0.6, className = '' }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── StaggerContainer ─── */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  distance?: number;
  direction?: 'up' | 'left' | 'right';
}

const staggerVariants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: { staggerChildren: staggerDelay },
  }),
};

const staggerChildVariants = {
  hidden: (direction: string) => {
    if (direction === 'left') return { opacity: 0, x: 50 };
    if (direction === 'right') return { opacity: 0, x: -50 };
    return { opacity: 0, y: 50 };
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function StaggerContainer({ children, className = '', staggerDelay = 0.1, direction = 'up' }: StaggerContainerProps) {
  return (
    <motion.div
      custom={staggerDelay}
      variants={staggerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {React.Children.map(children, (child) => (
        <motion.div custom={direction} variants={staggerChildVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── ParallaxMouse ─── */
interface ParallaxMouseProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function ParallaxMouse({ children, className = '', strength = 20 }: ParallaxMouseProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width * strength);
    y.set((e.clientY - centerY) / rect.height * strength);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── MagneticButton ─── */
interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className = '', strength = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }} onMouseMove={handleMouse} onMouseLeave={handleLeave} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── TiltCard ─── */
interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
}

export function TiltCard({ children, className = '', tiltAmount = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [tiltAmount, -tiltAmount]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-tiltAmount, tiltAmount]), { stiffness: 300, damping: 30 });

  const handleMouse = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => { x.set(0.5); y.set(0.5); };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
}
