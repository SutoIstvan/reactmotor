'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useMotionValue, animate, motion } from 'framer-motion';

export type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  speed?: number;
  speedOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
};

function useMeasure(): [
  (node: HTMLElement | null) => void,
  { width: number; height: number }
] {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const observerRef = React.useRef<ResizeObserver | null>(null);

  const ref = React.useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
      const update = () => {
        const width = node.offsetWidth || node.scrollWidth;
        const height = node.offsetHeight || node.scrollHeight;
        setDimensions({ width, height });
      };

      update();

      const observer = new ResizeObserver(([entry]) => {
        if (entry) {
          const width = entry.borderBoxSize?.[0]?.inlineSize ?? node.offsetWidth;
          const height = entry.borderBoxSize?.[0]?.blockSize ?? node.offsetHeight;
          setDimensions({ width, height });
        }
      });

      observer.observe(node);
      observerRef.current = observer;
    }
  }, []);

  return [ref, dimensions];
}

export function InfiniteSlider({
  children,
  gap = 16,
  speed = 100,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [isHovering, setIsHovering] = React.useState(false);
  const currentSpeed = isHovering && speedOnHover ? speedOnHover : speed;
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    let controls: { stop: () => void } | undefined;
    const size = direction === 'horizontal' ? width : height;
    if (!size || size <= 0) return;

    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    const distanceToTravel = Math.abs(to - from);
    const duration = distanceToTravel / currentSpeed;

    if (isTransitioning) {
      const remainingDistance = Math.abs(translation.get() - to);
      const transitionDuration = remainingDistance / currentSpeed;

      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: transitionDuration,
        onComplete: () => {
          setIsTransitioning(false);
          setKey((prevKey) => prevKey + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return () => {
      controls?.stop();
    };
  }, [
    key,
    translation,
    currentSpeed,
    width,
    height,
    gap,
    isTransitioning,
    direction,
    reverse,
  ]);

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setIsHovering(true);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setIsHovering(false);
        },
      }
    : {};

  return (
    <div className={cn('overflow-hidden min-w-0', className)}>
      <motion.div
        className={cn(
          'flex min-w-0',
          direction === 'horizontal' ? 'w-max' : 'w-full flex-col'
        )}
        style={{
          ...(direction === 'horizontal'
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        ref={ref}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
