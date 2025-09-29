import React from 'react';

interface AnimatedLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'red' | 'blue' | 'green' | 'yellow';
  text?: string;
}

const AnimatedLoading: React.FC<AnimatedLoadingProps> = ({
  size = 'md',
  color = 'red',
  text = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    red: 'border-red-600',
    blue: 'border-blue-600',
    green: 'border-green-600',
    yellow: 'border-yellow-600'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizeClasses[size]} border-4 border-gray-300 border-t-transparent rounded-full animate-spin`}
        />
        {/* Inner ring */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} border-2 border-transparent border-t-${color}-600 rounded-full animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
        />
      </div>
      
      {text && (
        <div className="text-gray-400 text-sm animate-pulse">
          {text}
        </div>
      )}
    </div>
  );
};

export default AnimatedLoading;
