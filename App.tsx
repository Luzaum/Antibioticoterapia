import React, { useState } from 'react';
import Home from './pages/Home';
import AntibioticsGuide from './pages/AntibioticsGuide';
import PatientGuide from './pages/PatientGuide';
import { Page, AntibioticClass, DiseaseSystem, Species, LifeStageKey, Disease, ComorbidityState } from './types';
import { AB_SEED as antibiotics } from './data/antibiotics';
import { DZ_SEED as diseases } from './data/diseases';

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

  return (
    <div>
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
        />
      )}
    </div>
  );
}