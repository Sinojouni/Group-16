import React, { useEffect, useState, useRef } from 'react';

interface StaggeredAnimationProps {
  children: React.ReactNode;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  duration?: number;
  className?: string;
}

const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  staggerDelay = 100,
  direction = 'up',
  duration = 600,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          setTimeout(() => {
            setIsVisible(true);
          }, staggerDelay);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [staggerDelay, hasTriggered]);

  const getTransformClasses = () => {
    const baseClasses = isVisible 
      ? 'translate-y-0 translate-x-0 opacity-100 scale-100' 
      : getInitialTransform();

    return baseClasses;
  };

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translate-y-16 opacity-0 scale-90';
      case 'down':
        return '-translate-y-16 opacity-0 scale-90';
      case 'left':
        return 'translate-x-16 opacity-0 scale-90';
      case 'right':
        return '-translate-x-16 opacity-0 scale-90';
      case 'fade':
        return 'opacity-0 scale-90';
      default:
        return 'translate-y-16 opacity-0 scale-90';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${getTransformClasses()} ${className}`}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {children}
    </div>
  );
};

export default StaggeredAnimation;
