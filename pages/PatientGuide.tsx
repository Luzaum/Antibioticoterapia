import React, { useState, useMemo } from 'react';
import { Page, DiseaseSystem, AntibioticClass, Species, LifeStageKey, Disease, ComorbidityState } from '../types';
import { safeList } from '../utils/dataUtils';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import InlineDrugSummary from '../components/InlineDrugSummary';
import { DZ_EXPLAIN, LIFE_STAGES, COMORB_HELP_TEXT } from '../constants';
import RichTextViewer from '../components/RichTextViewer';

const comorbLabels: { [key in keyof ComorbidityState]: string } = {
  renal: 'Renal',
  hepatic: 'Hepática',
  septic: 'Séptica',
  cardiac: 'Cardíaca',
};

interface PatientGuideProps {
  setPage: (page: Page) => void;
  dzDict: DiseaseSystem;
  abDict: AntibioticClass;
  onDeepLinkDrug: (drugName: string) => void;
  // New props for lifted state
  onReset: () => void;
  step: number;
  setStep: (step: number) => void;
  species: Species | null;
  setSpecies: (species: Species | null) => void;
  life: LifeStageKey | null;
  setLife: (life: LifeStageKey | null) => void;
  co: ComorbidityState;
  setCo: (co: ComorbidityState) => void;
  chosen: Disease | null;
  setChosen: (disease: Disease | null) => void;
}

const PatientGuide: React.FC<PatientGuideProps> = ({
  setPage,
  dzDict,
  abDict,
  onDeepLinkDrug,
  onReset,
  step,
  setStep,
  species,
  setSpecies,
  life,
  setLife,
  co,
  setCo,
  chosen,
  setChosen,
}) => {
  const systems = useMemo(() => Object.keys(dzDict).sort((a, b) => a.localeCompare(b, 'pt')), [dzDict]);
  const [modalInfo, setModalInfo] = useState<{ title: string, content: string } | null>(null);

  const getDzExplainBlock = (name: string) => {
    const e = DZ_EXPLAIN[name];
    if (!e) return { title: name, content: 'Nenhuma explicação detalhada disponível.' };
    return { 
      title: name,
      content: `##Fisiopatogenia##\n${e.physio}\n\n##Justificativa do Tratamento##\n${e.why}\n\n##Sinais Clínicos e Diagnóstico##\n${e.signs}\n\n##Terapias Adjuvantes e Manejo##\n${e.adjuncts}`
    };
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        const showSpeciesWarning = species && !life;
        const showLifeStageWarning = !species && life;

        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-lg font-semibold mb-3 transition-colors ${showSpeciesWarning ? 'text-red-600' : 'text-slate-700'}`}>1) Selecione a espécie</h3>
              <div className={`grid grid-cols-2 gap-4 rounded-xl border-2 p-1 transition-all ${showSpeciesWarning ? 'border-red-400' : 'border-transparent'}`}>
                <button onClick={() => setSpecies('Cão')} className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-transform duration-200 hover:scale-105 ${species === 'Cão' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400'}`}>
                    <span className="text-5xl" role="img" aria-label="Cão">🐶</span>
                    <span className="mt-2 font-bold text-lg">Cão</span>
                </button>
                <button onClick={() => setSpecies('Gato')} className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-transform duration-200 hover:scale-105 ${species === 'Gato' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400'}`}>
                    <span className="text-5xl" role="img" aria-label="Gato">🐱</span>
                    <span className="mt-2 font-bold text-lg">Gato</span>
                </button>
              </div>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-3 transition-colors ${showLifeStageWarning ? 'text-red-600' : 'text-slate-700'}`}>2) Selecione a fase da vida</h3>
              <div className={`rounded-xl border-2 p-1 transition-all ${showLifeStageWarning ? 'border-red-400' : 'border-transparent'}`}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(Object.keys(LIFE_STAGES) as LifeStageKey[]).map(k => {
                    const v = LIFE_STAGES[k];
                    return (
                    <div key={k}>
                      <button onClick={() => setLife(k)} className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition ${life === k ? 'bg-green-600 text-white font-semibold' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
                        <span>{v.label}</span>
                        {v.warn && <span role="button" onClick={(e) => { e.stopPropagation(); setModalInfo({title: `Alerta: ${v.label}`, content: v.warn_why || v.warn || 'Sem observações.'}); }} className={`p-1 rounded-full ${life === k ? 'hover:bg-white/20' : 'hover:bg-slate-400/50'}`}><Icon name="help" /></span>}
                      </button>
                      {life === k && v.warn && <div className="mt-2 text-xs bg-yellow-50 border-yellow-200 p-2 rounded text-yellow-900 font-medium">{v.warn}</div>}
                    </div>
                  )})}
                </div>
              </div>
            </div>
            <button disabled={!species || !life} onClick={() => setStep(2)} className="w-full rounded-lg bg-indigo-600 text-white py-3 font-semibold disabled:bg-slate-400 disabled:text-slate-600 transition hover:bg-indigo-700">Próximo</button>
            {(!species || !life) && <p className="text-center text-sm text-slate-500 mt-2">Por favor, selecione a espécie e a fase da vida para continuar.</p>}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-700">3) Selecione as comorbidades</h3>
              <button className="text-slate-600 hover:text-indigo-700 text-sm inline-flex items-center gap-1" onClick={() => setModalInfo({title: 'Ajustes por Comorbidade', content: COMORB_HELP_TEXT})}><Icon name="help" /> Dúvidas</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                {(Object.keys(co) as Array<keyof ComorbidityState>).map(k => (
                  <label key={k} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition text-slate-800 font-medium border-2 ${co[k] ? 'bg-green-100 border-green-500' : 'bg-slate-100 border-slate-300 hover:border-slate-400'}`}>
                    <input type="checkbox" className="hidden" checked={co[k]} onChange={e => setCo({ ...co, [k]: e.target.checked })} /> 
                    {comorbLabels[k]}
                  </label>
                ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="w-full rounded-lg bg-slate-500 text-white py-3 font-semibold transition hover:bg-slate-600">Voltar</button>
              <button onClick={() => setStep(3)} className="w-full rounded-lg bg-indigo-600 text-white py-3 font-semibold transition hover:bg-indigo-700">Próximo</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-700">4) Selecione a condição clínica</h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {systems.map(sys => (
                <div key={sys} className="bg-slate-50/70 rounded-lg border border-slate-200">
                  <div className="px-3 py-2 font-semibold text-slate-800">{sys}</div>
                  <div className="grid md:grid-cols-2 gap-2 p-3 border-t border-slate-200">
                    {safeList(dzDict[sys]).map((dz: Disease) => (
                      <button key={dz.name} onClick={() => setChosen(dz)} className={`${chosen?.name === dz.name ? 'bg-green-600 text-white ring-2 ring-green-700' : 'bg-white text-slate-700 hover:bg-green-50'} text-left px-4 py-2 rounded-md border border-slate-300 transition text-sm`}>{dz.name}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button onClick={() => setStep(2)} className="w-full rounded-lg bg-slate-500 text-white py-3 font-semibold transition hover:bg-slate-600">Voltar</button>
              <button disabled={!chosen} onClick={() => setStep(4)} className="w-full rounded-lg bg-indigo-600 text-white py-3 font-semibold disabled:bg-slate-400 disabled:text-slate-600 transition hover:bg-indigo-700">Ver recomendações</button>
            </div>
          </div>
        );
      case 4:
        if (!chosen) return null;
        return (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Recomendações para {chosen.name}</h2>
            <div className="text-sm bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4 text-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-base text-indigo-900 mb-1">{chosen.name}</div>
                  <div><b>Patógenos comuns:</b> <span className="italic">{chosen.pathogens || '—'}</span></div>
                  <div><b>Duração típica:</b> {chosen.duration || '—'}</div>
                  {chosen.notes && <div className="mt-1"><b>Notas:</b> {chosen.notes}</div>}
                </div>
                <button className="text-slate-700 hover:text-indigo-700 flex-shrink-0" title="Ver explicações detalhadas" onClick={() => setModalInfo(getDzExplainBlock(chosen.name))}><Icon name="help" /></button>
              </div>
            </div>
            <div className="space-y-4">
              {safeList(chosen.first_line).length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2 text-lg">Primeira Escolha (Empírico)</h4>
                  <div className="space-y-2">
                    {chosen.first_line.map((n, i) => (
                      <InlineDrugSummary key={`first-${i}`} name={n} abDict={abDict} onSeeGuide={onDeepLinkDrug} comorbidities={co} />
                    ))}
                  </div>
                </div>
              )}
              {safeList(chosen.alternatives).length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2 mt-4 text-lg">Alternativas / Escalonamento</h4>
                   <div className="space-y-2">
                    {chosen.alternatives.map((n, i) => (
                     <InlineDrugSummary key={`alt-${i}`} name={n} abDict={abDict} onSeeGuide={onDeepLinkDrug} comorbidities={co} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={onReset} className="mt-8 w-full rounded-lg bg-indigo-600 text-white py-3 font-semibold transition hover:bg-indigo-700">Nova Consulta</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8 animate-fade-in">
      <button onClick={() => setPage('home')} className="mb-6 flex items-center text-slate-600 hover:text-slate-900 font-semibold"><Icon name="back" className="h-5 w-5 mr-2" />Voltar</button>
      <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Guia por Paciente</h1>
      <div className="bg-white rounded-2xl shadow-sm p-6 max-w-4xl mx-auto">{renderStep()}</div>
      <Modal open={!!modalInfo} title={modalInfo?.title || 'Ajuda'} onClose={() => setModalInfo(null)}>
        <RichTextViewer text={modalInfo?.content || ''} />
      </Modal>
    </div>
  );
};

export default PatientGuide;