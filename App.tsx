import React, { useState } from 'react';
import Home from './pages/Home';
import AntibioticsGuide from './pages/AntibioticsGuide';
import PatientGuide from './pages/PatientGuide';
import { Page, AntibioticClass, DiseaseSystem } from './types';
import { antibiotics } from './data/antibiotics';
import { diseases } from './data/diseases';

// Array of pill colors with actual color values instead of Tailwind classes
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
  }, // black
]

export function App() {
  const [page, setPage] = useState<Page>('home');
  const [abDict, setAbDict] = useState<AntibioticClass>(antibiotics);
  const [dzDict, setDzDict] = useState<DiseaseSystem>(diseases);
  const [focusDrug, setFocusDrug] = useState<string | null>(null);
  const [sourcePage, setSourcePage] = useState<Page | null>(null);

  const onMergeAB = (data: AntibioticClass) => {
    setAbDict(data);
  };

  const onMergeDZ = (data: DiseaseSystem) => {
    setDzDict(data);
  };

  const onDeepLinkDrug = (drugName: string) => {
    setFocusDrug(drugName);
    setSourcePage(page);
    setPage('ab');
  };

  const onReset = () => {
    setPage('home');
    setFocusDrug(null);
    setSourcePage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Pills Pattern */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          zIndex: 0,
        }}
      >
        {/* Generate 30 random pills with different colors and positions */}
        {Array.from({
          length: 30,
        }).map((_, index) => {
          const color =
            pillColors[Math.floor(Math.random() * pillColors.length)]
          const rotation = Math.floor(Math.random() * 360)
          const top = Math.floor(Math.random() * 100)
          const left = Math.floor(Math.random() * 100)
          const opacity = Math.random() * 0.2 + 0.05 // Between 0.05 and 0.25
          const scale = 0.5 + Math.random() * 1.5 // Between 0.5 and 2
          return (
            <div
              key={index}
              className="absolute"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                transform: `rotate(${rotation}deg) scale(${scale})`,
                opacity: opacity,
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
          )
        })}
      </div>
      
      {/* Main Content - with higher z-index to appear above the pattern */}
      <div className="relative z-10">
        {page === 'home' && (
          <Home 
            setPage={setPage} 
            onMergeAB={onMergeAB} 
            onMergeDZ={onMergeDZ} 
          />
        )}
        {page === 'ab' && (
          <AntibioticsGuide 
            setPage={setPage} 
            abDict={abDict} 
            focusDrug={focusDrug}
            sourcePage={sourcePage}
          />
        )}
        {page === 'paciente' && (
          <PatientGuide 
            setPage={setPage} 
            dzDict={dzDict} 
            abDict={abDict}
            onDeepLinkDrug={onDeepLinkDrug}
            onReset={onReset}
          />
        )}
      </div>
    </div>
  );
}