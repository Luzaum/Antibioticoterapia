import React, { useState } from 'react';
import Home from './pages/Home';
import AntibioticsGuide from './pages/AntibioticsGuide';
import PatientGuide from './pages/PatientGuide';
import { Page, AntibioticClass, DiseaseSystem, Species, LifeStageKey, Disease, ComorbidityState } from './types';
import { AB_SEED as antibiotics } from './data/antibiotics';
import { DZ_SEED as diseases } from './data/diseases';
import { PillIcon, StethoscopeIcon } from 'lucide-react';

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
];

export function App() {
  const [page, setPage] = useState<Page>('home');
  const [abDict, setAbDict] = useState<AntibioticClass>(antibiotics);
  const [dzDict, setDzDict] = useState<DiseaseSystem>(diseases);
  const [focusDrug, setFocusDrug] = useState<string | null>(null);
  const [sourcePage, setSourcePage] = useState<Page | null>(null);
  
  // PatientGuide state
  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState<Species | null>(null);
  const [life, setLife] = useState<LifeStageKey | null>(null);
  const [co, setCo] = useState<ComorbidityState>({
    renal: false,
    hepatic: false,
    septic: false,
    cardiac: false
  });
  const [chosen, setChosen] = useState<Disease | null>(null);

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
    setStep(1);
    setSpecies(null);
    setLife(null);
    setCo({
      renal: false,
      hepatic: false,
      septic: false,
      cardiac: false
    });
    setChosen(null);
  };

  // Se não estiver na página home, renderizar as páginas originais
  if (page !== 'home') {
    if (page === 'ab') {
      return <AntibioticsGuide 
        setPage={setPage} 
        abDict={abDict} 
        focusDrug={focusDrug}
        sourcePage={sourcePage}
      />;
    }
    if (page === 'paciente') {
      return <PatientGuide 
        setPage={setPage} 
        dzDict={dzDict} 
        abDict={abDict}
        onDeepLinkDrug={onDeepLinkDrug}
        onReset={onReset}
        step={step}
        setStep={setStep}
        species={species}
        setSpecies={setSpecies}
        life={life}
        setLife={setLife}
        co={co}
        setCo={setCo}
        chosen={chosen}
        setChosen={setChosen}
      />;
    }
  }

  return (
    <>
      {/* CSS para animação */}
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
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        {/* Background Pills Pattern */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            zIndex: 0,
          }}
        >
                  {/* Generate 60 random pills with different colors and positions */}
        {Array.from({
          length: 60,
        }).map((_, index) => {
            const color =
              pillColors[Math.floor(Math.random() * pillColors.length)]
            const rotation = Math.floor(Math.random() * 360)
            const top = Math.floor(Math.random() * 120) - 10 // Between -10% and 110%
            const opacity = Math.random() * 0.15 + 0.03 // Between 0.03 and 0.18
            const scale = 0.3 + Math.random() * 1.8 // Between 0.3 and 2.1
            const duration = 15 + Math.random() * 25 // Between 15s and 40s
            const delay = Math.random() * 20 // Random delay up to 20s
            
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
                  animationDelay: `${delay}s`,
                } as React.CSSProperties & { [key: string]: any }}
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
        <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">
              Antibioticoterapia
            </h1>
            <p className="text-blue-700 text-lg">
              Guia clínico de antibióticos e condições para medicina veterinária.
            </p>
          </header>

          {/* Main Cards - Vertical Layout */}
          <div className="flex flex-col gap-6 mb-12 max-w-md mx-auto">
            <button 
              onClick={() => setPage('ab')}
              className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white text-center transform hover:scale-105 cursor-pointer"
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white/20 rounded-full">
                  <PillIcon size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3">Guia de Antibióticos</h2>
              <p className="opacity-90">
                Consulte fármacos, espectro, e use a calculadora de dose.
              </p>
            </button>

            <button 
              onClick={() => setPage('paciente')}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white text-center transform hover:scale-105 cursor-pointer"
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white/20 rounded-full">
                  <StethoscopeIcon size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-3">Guia por Paciente</h2>
              <p className="opacity-90">
                Receba recomendações baseadas no paciente e condição.
              </p>
            </button>
          </div>

          {/* Footer */}
          <footer className="text-center text-gray-500 text-sm mt-12">
            <p>
              Ferramenta educacional. Para uso clínico: baseie-se em
              cultura/antibiograma e consensos atualizados.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}