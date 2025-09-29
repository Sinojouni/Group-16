import React, { useState } from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: boolean;
  hoverGlow?: boolean;
  delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  hoverScale = true,
  hoverGlow = false,
  delay = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = `
    transition-all duration-500 ease-out
    ${hoverScale ? 'hover:scale-105 hover:-translate-y-2' : ''}
    ${hoverGlow ? 'hover:shadow-2xl hover:shadow-red-500/30' : 'hover:shadow-xl hover:shadow-gray-500/20'}
    transform-gpu
    will-change-transform
  `;

  const animationStyle = {
    animationDelay: `${delay}ms`,
    animationFillMode: 'both' as const
  };

  return (
    <div
      className={`${baseClasses} ${className}`}
      style={animationStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
