'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  initialPosition?: number;
  className?: string;
  locale?: 'ar' | 'en';
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  initialPosition = 50,
  className = '',
  locale = 'ar',
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);

  const isRtl = locale === 'ar';

  const getPosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return position;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(5, Math.min(95, (x / rect.width) * 100));
  }, [position]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setPosition(getPosition(e.clientX));
  }, [getPosition]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => setPosition(getPosition(e.clientX));
    const onUp = () => setDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging, getPosition]);

  const displayPos = isRtl ? 100 - position : position;
  const dividerLeft = `${position}%`;
  const clipWidth = `${isRtl ? 100 - position : position}%`;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none touch-none w-full bg-gray-200 ${className}`}
      style={{ borderRadius: 24, aspectRatio: '4/3', minHeight: 280 }}
    >
      <Image
        src={afterImage}
        alt="After"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
        draggable={false}
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          width: clipWidth,
          transition: dragging ? 'none' : 'width 0.15s ease-out',
          marginInlineStart: isRtl ? 'auto' : undefined,
          marginInlineEnd: isRtl ? undefined : 'auto',
        }}
      >
        <Image
          src={beforeImage}
          alt="Before"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          draggable={false}
          style={{ maxWidth: 'none' }}
        />
      </div>

      <span
        className="absolute top-3 z-10 pointer-events-none bg-black/50 text-white text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm"
        style={isRtl ? { right: 12 } : { left: 12 }}
      >
        {locale === 'en' ? 'Before' : 'قبل'}
      </span>
      <span
        className="absolute top-3 z-10 pointer-events-none bg-black/50 text-white text-xs px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm"
        style={isRtl ? { left: 12 } : { right: 12 }}
      >
        {locale === 'en' ? 'After' : 'بعد'}
      </span>

      <div
        className="absolute top-0 bottom-0 z-20 cursor-ew-resize"
        style={{
          left: dividerLeft,
          width: 3,
          transform: 'translateX(-50%)',
          transition: dragging ? 'none' : 'left 0.15s ease-out',
        }}
        onPointerDown={onPointerDown}
      >
        <div className="absolute inset-0 bg-white shadow-[0_0_6px_rgba(0,0,0,0.2)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
              dragging ? 'scale-110 bg-[#6DB3D7] text-white shadow-[0_0_20px_rgba(109,179,215,0.6)]' : 'text-[#6DB3D7]'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 3 12 9 6" />
              <polyline points="15 6 21 12 15 18" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
