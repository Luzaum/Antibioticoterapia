import React, { useState, useEffect, useCallback } from 'react';
import { AB_SEED } from './data/antibiotics';
import { DZ_SEED } from './data/diseases';
import { dedupeABDict, dedupeDZDict } from './utils/dataUtils';
import { canonicalDrugName, canonicalDiseaseName } from './utils/textUtils';
import { parseCSV } from './utils/csvParser';
import Home from './pages/Home';
import AntibioticsGuide from './pages/AntibioticsGuide';
import PatientGuide from './pages/PatientGuide';
import { Page, AntibioticClass, DiseaseSystem, Species, LifeStageKey, ComorbidityState, Disease } from './types';

const selfTests = () => {
  try {
    console.group('[self-tests]');
    console.assert(canonicalDrugName('Pip/Tazo') === 'piperacilina + tazobactam', 'Alias Pip/Tazo');
    console.assert(canonicalDrugName('Amoxi-Clav') === 'amoxicilina + clavulanato', 'Alias Amoxi-Clav');
    const dup = { 'β-Lactâmicos': [{ name: 'Amoxi-Clav', dose_dog: '10 mg/kg', dose_cat: '10 mg/kg', spectrum: '', indications: '', cautions: '' }] };
    const merged = dedupeABDict({ ...AB_SEED, ...dup });
    const count = Object.values(merged).flat().filter(d => canonicalDrugName(d.name) === 'amoxicilina + clavulanato').length;
    console.assert(count === 1, 'Dedupe AB deve unir aliases');

    const d1 = { 'Trato Respiratório': [{ name: 'piotorax', first_line: ['Amoxi-Clav'], alternatives: [], pathogens: '', duration: '', notes: '' }] };
    const mergedDz = dedupeDZDict({ ...DZ_SEED, ...d1 });
    const dzCount = Object.values(mergedDz).flat().filter(d => canonicalDiseaseName(d.name) === 'piotorax').length;
    console.assert(dzCount === 1, 'Dedupe DZ deve unir aliases');
    
    const csv = '\uFEFFa,b\n"x,1",y\n';
    const rows = parseCSV(csv);
    console.assert(rows.length === 2 && rows[0].length === 2 && rows[1][0] === 'x,1', 'parseCSV com BOM e vírgulas');
    
    console.groupEnd();
  } catch (e) {
    console.warn('self-tests falharam:', e);
  }
};

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [abDict, setAbDict] = useState<AntibioticClass>(() => dedupeABDict(AB_SEED));
  const [dzDict, setDzDict] = useState<DiseaseSystem>(() => dedupeDZDict(DZ_SEED));
  const [focusDrug, setFocusDrug] = useState<string | null>(null);
  const [sourcePage, setSourcePage] = useState<Page | null>(null);

  // Lifted state from PatientGuide
  const [patientStep, setPatientStep] = useState(1);
  const [patientSpecies, setPatientSpecies] = useState<Species | null>(null);
  const [patientLife, setPatientLife] = useState<LifeStageKey | null>(null);
  const [patientCo, setPatientCo] = useState<ComorbidityState>({ renal: false, hepatic: false, septic: false, cardiac: false });
  const [patientChosen, setPatientChosen] = useState<Disease | null>(null);

  useEffect(() => {
    selfTests();
  }, []);

  const resetPatientGuide = useCallback(() => {
    setPatientStep(1);
    setPatientSpecies(null);
    setPatientLife(null);
    setPatientCo({ renal: false, hepatic: false, septic: false, cardiac: false });
    setPatientChosen(null);
  }, []);

  const handleSetPage = useCallback((newPage: Page) => {
    if (page === 'ab' && newPage !== 'ab') {
      setFocusDrug(null);
      setSourcePage(null);
    }
    // Reset patient guide state when navigating back to home
    if (page === 'paciente' && newPage === 'home') {
      resetPatientGuide();
    }
    setPage(newPage);
  }, [page, resetPatientGuide]);

  const deepLink = useCallback((drugName: string) => {
    setFocusDrug(drugName);
    setSourcePage('paciente');
    setPage('ab');
  }, []);

  const mergeAB = useCallback((incoming: AntibioticClass) => {
    setAbDict(prevDict => {
        const next = { ...prevDict };
        for (const cls of Object.keys(incoming || {})) {
            next[cls] = [...(next[cls] || []), ...(incoming[cls] || [])];
        }
        return dedupeABDict(next);
    });
  }, []);

  const mergeDZ = useCallback((incoming: DiseaseSystem) => {
    setDzDict(prevDict => {
        const next = { ...prevDict };
        for (const sys of Object.keys(incoming || {})) {
            next[sys] = [...(next[sys] || []), ...(incoming[sys] || [])];
        }
        return dedupeDZDict(next);
    });
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'ab':
        return <AntibioticsGuide setPage={handleSetPage} abDict={abDict} focusDrug={focusDrug} sourcePage={sourcePage} />;
      case 'paciente':
        return <PatientGuide
                  setPage={handleSetPage}
                  dzDict={dzDict}
                  abDict={abDict}
                  onDeepLinkDrug={deepLink}
                  onReset={resetPatientGuide}
                  step={patientStep}
                  setStep={setPatientStep}
                  species={patientSpecies}
                  setSpecies={setPatientSpecies}
                  life={patientLife}
                  setLife={setPatientLife}
                  co={patientCo}
                  setCo={setPatientCo}
                  chosen={patientChosen}
                  setChosen={setPatientChosen}
                />;
      case 'home':
      default:
        return <Home setPage={handleSetPage} onMergeAB={mergeAB} onMergeDZ={mergeDZ} />;
    }
  };

  return (
    <div className="font-sans bg-slate-50">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
      {renderPage()}
    </div>
  );
};

export default App;