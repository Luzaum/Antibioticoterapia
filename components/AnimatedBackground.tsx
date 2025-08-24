import React, { useEffect, useRef, useState } from 'react';

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

interface Pill {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  color: number;
  rotation: number;
  opacity: number;
  scale: number;
}

// Global state to persist across component remounts
let globalPills: Pill[] = [];
let isGlobalInitialized = false;
let nextPillId = 0;

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ pillCount = 150 }) => {
  const [pills, setPills] = useState<Pill[]>([]);
  const animationRef = useRef<number>();
  const lastPillTimeRef = useRef<number>(Date.now());

  // Initialize or restore pill states
  useEffect(() => {
    if (!isGlobalInitialized) {
      // Initialize 150 pills spread across the screen (50% increase from 100)
      const initialPills: Pill[] = [];
      
      for (let i = 0; i < 150; i++) {
        const seed1 = i * 9973;
        const seed2 = i * 7919;
        const seed3 = i * 6421;
        const seed4 = i * 4801;
        const seed5 = i * 3571;
        
        initialPills.push({
          id: nextPillId++,
          x: Math.random() * window.innerWidth, // Random X across screen
          y: ((seed3 * 41) % 140) - 20, // Random Y
          delay: 0, // No delay for initial pills
          duration: ((seed2 * 61) % 54) + 13.5, // 13.5-67.5s duration (35% slower)
          color: Math.floor((seed1 % 1000) / 1000 * pillColors.length),
          rotation: (seed2 * 137) % 360,
          opacity: ((seed5 * 29) % 20) / 100 + 0.05,
          scale: ((seed1 * 47) % 20) / 10 + 0.4
        });
      }
      
      globalPills = initialPills;
      isGlobalInitialized = true;
    }
    
    setPills([...globalPills]);
  }, [pillCount]);

  // Animation loop to update positions and generate new pills
  useEffect(() => {
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - lastPillTimeRef.current) / 1000;

      setPills(prevPills => {
        let newPills = [...prevPills];
        
        // Update existing pills
        newPills = newPills.map(pill => {
          const speed = window.innerWidth / (pill.duration * 60); // pixels per frame
          let newX = pill.x - speed;
          
          // Remove pills that go off screen
          if (newX < -100) {
            return null;
          }
          
          return { ...pill, x: newX };
        }).filter(Boolean) as Pill[];
        
        // Generate new pills from the right
        if (elapsed > 0.5) { // Generate new pill every 0.5 seconds
          const seed1 = Math.random() * 10000;
          const seed2 = Math.random() * 10000;
          const seed3 = Math.random() * 10000;
          const seed4 = Math.random() * 10000;
          const seed5 = Math.random() * 10000;
          
          newPills.push({
            id: nextPillId++,
            x: window.innerWidth + 100, // Start from right edge
            y: ((seed3 * 41) % 140) - 20,
            delay: 0,
            duration: ((seed2 * 61) % 54) + 13.5, // 13.5-67.5s duration (35% slower)
            color: Math.floor((seed1 % 1000) / 1000 * pillColors.length),
            rotation: (seed2 * 137) % 360,
            opacity: ((seed5 * 29) % 20) / 100 + 0.05,
            scale: ((seed1 * 47) % 20) / 10 + 0.4
          });
          
          lastPillTimeRef.current = currentTime;
        }
        
        // Update global state
        globalPills = newPills;
        return newPills;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Background Pills Pattern */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          zIndex: 0,
        }}
      >
        {/* Render pills with their current positions */}
        {pills.map((pill) => {
          const color = pillColors[pill.color];
          
          return (
            <div
              key={pill.id}
              className="absolute"
              style={{
                top: `${pill.y}%`,
                left: `${pill.x}px`,
                opacity: pill.opacity,
                transform: `rotate(${pill.rotation}deg) scale(${pill.scale})`,
                transition: 'transform 0.1s ease-out',
              }}
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
