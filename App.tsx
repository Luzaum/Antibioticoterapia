import React, { useState } from 'react';
import Home from './pages/Home';
import AntibioticsGuide from './pages/AntibioticsGuide';
import PatientGuide from './pages/PatientGuide';
import { Page, AntibioticClass, DiseaseSystem } from './types';
import { AB_SEED as antibiotics } from './data/antibiotics';
import { DZ_SEED as diseases } from './data/diseases';

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
        />
      )}
    </div>
  );
}