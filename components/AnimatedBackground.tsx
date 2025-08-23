import React from 'react';

// Array de cores das pílulas
const pillColors = [
  {
    primary: '#3B82F6',
    secondary: 'white',
  },
  {
    primary: '#FBBF24',
    secondary: 'white',
  },
  {
    primary: '#10B981',
    secondary: 'white',
  },
  {
    primary: '#EF4444',
    secondary: 'white',
  },
  {
    primary: '#8B5CF6',
    secondary: 'white',
  },
  {
    primary: '#000000',
    secondary: 'white',
  },
];

interface AnimatedBackgroundProps {
  pillCount?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ pillCount = 100 }) => {
  return (
    <>
      {/* CSS para animação horizontal com continuidade */}
      <style>{`
        @keyframes moveLeft {
          0% {
            transform: translateX(100vw) rotate(var(--rotation)) scale(var(--scale));
          }
          100% {
            transform: translateX(-100px) rotate(var(--rotation)) scale(var(--scale));
          }
        }
        .animated-pill {
          animation: moveLeft var(--duration) linear infinite;
          animation-delay: var(--delay);
          animation-play-state: running;
        }
        .animated-pill.paused {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Background Pills Pattern */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          zIndex: 0,
        }}
      >
        {/* Generate pills with horizontal animation and better distribution */}
        {Array.from({ length: pillCount }).map((_, index) => {
          // Use multiple different seeds for better distribution
          const seed1 = index * 9973;
          const seed2 = index * 7919;
          const seed3 = index * 6421;
          const seed4 = index * 4801;
          const seed5 = index * 3571;
          
          const color = pillColors[Math.floor((seed1 % 1000) / 1000 * pillColors.length)];
          const rotation = (seed2 * 137) % 360;
          // Better vertical distribution using sine wave pattern
          const baseTop = (index / pillCount) * 100; // Distribute evenly from 0-100%
          const variation = Math.sin(seed3 * 0.01) * 30; // Add sine wave variation
          const top = Math.max(-10, Math.min(110, baseTop + variation)); // Between -10% and 110%
          const opacity = ((seed4 * 29) % 15) / 100 + 0.03; // Between 0.03 and 0.18
          const scale = ((seed5 * 47) % 18) / 10 + 0.3; // Between 0.3 and 2.1
          const duration = ((seed1 * 61) % 25) + 15; // Between 15s and 40s
          const delay = ((seed2 * 83) % 20); // Random delay up to 20s
          
          return (
            <div
              key={index}
              className="absolute animated-pill"
              style={{
                top: `${top}%`,
                left: '-100px',
                opacity: opacity,
                '--rotation': `${rotation}deg`,
                '--scale': scale,
                '--duration': `${duration}s`,
                '--delay': `${delay}s`,
              } as React.CSSProperties}
            >
              <svg
                width="60"
                height="24"
                viewBox="0 0 60 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24H48C54.627 24 60 18.627 60 12C60 5.373 54.627 0 48 0H12Z"
                  fill={color.primary}
                />
                <path
                  d="M30 0H12C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24H30V0Z"
                  fill={color.secondary}
                />
              </svg>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AnimatedBackground;
