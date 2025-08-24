import React, { useState } from 'react';
import Home from './pages/Home';
import AntibioticsGuide from './pages/AntibioticsGuide';
import PatientGuide from './pages/PatientGuide';
import { Page, AntibioticClass, DiseaseSystem, Species, LifeStageKey, Disease, ComorbidityState } from './types';
import { AB_SEED as antibiotics } from './data/antibiotics';
import { DZ_SEED as diseases } from './data/diseases';
import { PillIcon, StethoscopeIcon } from 'lucide-react';
import AnimatedBackground from './components/AnimatedBackground';



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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        {/* Animated Background */}
        <AnimatedBackground pillCount={150} />

        {/* Main Content - transparent background */}
        <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
          {/* Header */}
          <header className="text-center mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg inline-block">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">
                Antibioticoterapia
              </h1>
              <p className="text-blue-700 text-lg">
                Guia clínico de antibióticos e condições para medicina veterinária.
              </p>
            </div>
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
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md inline-block">
              <p>
                Ferramenta educacional. Para uso clínico: baseie-se em
                cultura/antibiograma e consensos atualizados.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}